"use client";
import { useEffect, createContext } from "react";
import { init, track, setUserId, identify as sendIdentify, Identify } from "@amplitude/analytics-browser";
import { BaseEvent } from "@amplitude/analytics-types";
import { useSearchParams } from "next/navigation"


const AMPLITUDE_API_KEY = "965234b74d0168da95098e204d3d8722";
//  process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
export enum FEATURE {
  RISK = 'Risk',
  MEETING = 'Neeting',
  VISION = 'Vision',
  OBJECTIVE = 'Objective',
}
export enum BUTTON_NAME {
  ADD_RISK = 'Add_risk',
  EDIT_RISK = 'Edit_risk',
  EDIT_AGENDA_ITEM = 'edit_agenda_item',
  ADD_MEETING = 'add_meeting',
  EDIT_MEETING = 'edit_meeting',
  EDIT_VISION = 'edit_vision',
}

export enum EVENT_TYPE {
  CLICK = 'Click',
  KEY_STEP = 'Key Step',
  VIEW = 'View',
}

export enum BUTTON_LOCATION {
  DASHBOARD = 'Dashboard',
  RISK = 'Risk_modal',
  MEETING_PAGE = 'board_agenda',
  VISION = 'vision_purpose',
}

export enum EVENT_NAME {
  KEY_STEP = 'Key Step',
  BUTTON_CLICKED = 'Button Clicked',
  RISK_SAVE = 'Risk Saved',
  NEW_MEETING_ADDED = 'New Meeting Added',
  SCREEN_VIEWED = 'Screen Viewed',
  FINALISE_AGENDA = 'Finalise Agenda',
  AGENDA_ITEM_EDITED = 'Agenda Item Edited',
  MEETING_START = 'Meeting Start',
  MEETING_FINALISED = 'Meeting Finalised',
  OBJECTIVE_STATUS = 'Objective Saved',
  VISION_SAVED = "Vision saved",
}

export enum EVENT_PROPERTY {
  EDIT_RISK = "edit_risk",
  ADD_RISK = "add_risk",
  ADD_RISK_MITIGATION = "add_risk_mitigation",
  NONE = "N/A",
  BOARD_AGENDA = "board_agenda",
  EDIT_VISION = "edit_vision",
  CORPORATE_OBJECTIVES = "corporate_objective",
  OBJECTIVES_MODAL = "objective_modal",
  EDIT_OBJECTIVES = "edit_objective",
  ADD_KEY_INDICATOR = "add_key_indicator",
}

export enum EVENT_PRIORITY {
  MUST = "must",
  SHOULD = "should",
}

export enum PLATFORM {
  WEB = "web"
}

interface AmplitudeContextType {
  trackAmplitudeEvent: (eventName: string | BaseEvent, eventProperties?: Record<string, any>) => void;
  initializeUser: (sub: string, email: string, first_name: string, last_name: string) => void;
}

export const AmplitudeContext = createContext<AmplitudeContextType | undefined>(undefined);

const AmplitudeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const pathName = typeof window !== 'undefined' && window.location.href

  useEffect(() => {
    init(AMPLITUDE_API_KEY ?? '0', undefined, {
      defaultTracking: {
        sessions: true,
      },
    });
  }, []);

  const trackAmplitudeEvent = (eventName: string | BaseEvent, eventProperties: Record<string, any> | undefined) => {
    if (typeof window !== 'undefined') {
      if (!window.location.toString().includes('secure.seeio.co.uk')) {
        return
      }
    }
    const utm_object = {
      utm_campaign: '',
      utm_source: '',
      utm_medium: '',
    };

    if (pathName && pathName?.includes('utm_campaign') && params?.get("utm_campaign")) {
      utm_object.utm_campaign = params.get("utm_campaign") || ''
    }

    if (pathName && pathName?.includes('utm_source') && params?.get("utm_source")) {
      utm_object.utm_source = params.get("utm_source") || ''
    }

    if (pathName && pathName?.includes('utm_medium') && params?.get("utm_medium")) {
      utm_object.utm_medium = params.get("utm_medium") || ''
    }

    if (pathName && pathName?.includes('utm_campaign')) {
      utm_object.utm_campaign = 'query.utm_campaign'
    }

    if (pathName && pathName?.includes('utm_source')) {
      utm_object.utm_source = 'query.utm_source'
    }

    if (pathName && pathName?.includes('utm_medium')) {
      utm_object.utm_medium = 'query.utm_medium'
    }
    track(
      eventName,
      {
        ...eventProperties,
        ...utm_object,
        is_dev: process.env.NODE_ENV !== 'production',
      }
    );
  };

  const initializeUser = (sub: string, email: string, first_name: string, last_name: string) => {
    // Set user properties here
    const identify = new Identify()

    identify.set('userId', sub);
    identify.set('first_name', first_name);
    identify.set('last_name', last_name);
    identify.set('email', email);

    sendIdentify(identify);
    setUserId(sub);
  }

  const value = { trackAmplitudeEvent, initializeUser };

  return (
    <AmplitudeContext.Provider value={value}>
      {children}
    </AmplitudeContext.Provider>
  );
};

export default AmplitudeContextProvider;    