import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Joyride, { Placement } from "react-joyride";
import { Progress } from "antd";
import { useDispatch } from "react-redux";

import FlexBox from "../flex-box";
import Typography from "../typography";
import Space from "../space";
import styles from "./tour.module.scss";
import { setConfigActions } from "@/store/account/setConfig";
import { DATA_ROOM_STEPS } from "@/constants";

interface IProps {
  userViewed?: boolean;
  start?: boolean;
  onRouteChange?: string;
  setBreadcrumbs?: () => void;
  onGoingStep?: DATA_ROOM_STEPS;
}

const TourComponent = ({
  start,
  onRouteChange,
  setBreadcrumbs,
  onGoingStep,
}: IProps) => {
  const dispatch = useDispatch();
  const { setConfig } = setConfigActions;

  const [customStepIndex, setCustomStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<any>([]);

  const router = useRouter();
  const pathName = usePathname();
  const totalSteps = useMemo(() => {
    let total;
    if (onGoingStep === DATA_ROOM_STEPS.DATA_ROOM || onGoingStep === DATA_ROOM_STEPS.DOCUMENT_LEVEL || onGoingStep === DATA_ROOM_STEPS.VIEW_DOCUMENT) {
      total = 3
    } else if (pathName?.includes("business-health")) {
      total = 7
    } else if (pathName?.includes("records")) {
      total = 5
    } else {
      total = 3
    }
    return total
  }, [onGoingStep])

  const percent = (customStepIndex / totalSteps) * 100;

  const steps = [
    {
      target: "#row0",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Vision and Mission
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              This section is where you set out your high level business
              purpose, and your corporate values. Setting a clear vision,
              mission, and values helps align your direction, guide
              decision-making, differentiate yourself, attract talent, and build
              trust with stakeholders. It provides a roadmap for success,
              fostering unity, and ensuring that actions are in line with the
              business purpose and principles.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#create_purpose",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Setting your Vision and Mission
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              The organisation&apos;s vision sets out the long-term goal or
              desired outcome, painting a picture of what success looks like in
              the future. On the other hand, the mission defines the purpose,
              outlining what it does, who it serves, and how it fulfills its
              objectives in the present. In short, the vision is the long term
              goal, while the mission is the matter in hand today.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "top-start" as Placement,
      hideCloseButton: true,
    },
    {
      target: "#create_value",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Corporate Values
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Best practice suggests that a company should aim for a concise set
              of core values, typically between three to seven, to ensure
              clarity and focus. These values should reflect both internal
              principles guiding employee behavior and external principles
              shaping interactions with customers, partners, and the community.
              It&apos;s important to choose values that are authentic,
              meaningful, and actionable, aligning closely with the
              company&apos;s vision, mission, and culture.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "top-start" as Placement,
      hideCloseButton: true,
    },
    {
      target: "#create_internal_value",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Internal values
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Internal values should center on fostering a positive workplace
              culture, guiding employee behavior, and driving organisational
              decisions. These values may include integrity, collaboration,
              innovation, diversity, accountability, and continuous learning.
              They serve as the foundation for a supportive and productive work
              environment, promoting employee engagement, satisfaction, and
              retention.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "top-start" as Placement,
      hideCloseButton: true,
    },
    {
      target: "#objectives_table",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Objective setting
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Setting SMART objectives is crucial for the SEEIO platform&apos;s
              direction. These goals, alongside key performance indicators
              (KPIs), drive the platform&apos;s investor reporting
              functionalities. Objectives outline the platform&apos;s aims,
              while KPIs measure progress, ensuring transparency and
              accountability, and guiding strategic decisions within SEEIO.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "top-start" as Placement,
      hideCloseButton: true,
    },
    {
      target: "#risks_graphs",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Risk management
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Understanding and managing corporate risks on the platform is
              vital for any organisation aiming for resilience and sustained
              success. It encourages users to identify and plan for potential
              challenges by setting and managing a defined set of risks.
              Effectively handling these risks not only safeguards operations
              but also improves the platform&apos;s risk score. This score
              reflects an organisation&apos;s commitment to risk management,
              enhancing its reputation and trustworthiness among stakeholders.
              By focusing on these areas, companies can navigate uncertainties
              more effectively, ensuring stability and growth.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "bottom-start" as Placement,
      hideCloseButton: true,
    },
    {
      target: "#risks_table",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Template risks
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              When you set up a new company on the platform, the platform
              creates a template of generic risks designed to stimulate the
              thought process. These can be tailored to specific circumstances,
              with options to add or delete risks. An automatic impact and
              probability analysis determines the review frequency, which can be
              adjusted by adding mitigations marked as &apos;Done&apos;,
              enhancing risk management customisation and effectiveness.
            </Typography>
          </FlexBox>
        </>
      ),
      placement: "top-start" as Placement,
      hideCloseButton: true,
    },
  ];

  const recordSteps = [
    {
      target: "#row0",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Point of Truth
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              The records section on the platform serves as the central point of
              truth , storing the latest executed and Word versions of important
              documents. It mirrors a typical data room structure, with
              documents assigned review dates and integrated into the governance
              timetable to maintain currency. Key documents requiring board
              approval are automatically added to board agendas, ensuring timely
              review and validation.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#buttons",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Organising your documents
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              You can efficiently organise documents into folders within the
              records section for better management. To make a document visible
              in a data room, simply click the three dots located to the right
              of the document. This feature allows for straightforward
              navigation and access, ensuring that your important documents are
              arranged logically and are readily available when needed.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#add_folder",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Add folder
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To add a folder, simply give the folder a name and click save
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#add_document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Transaction bibles
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Transaction Bibles archive all documents of a specific
              transaction, providing a static, historical record. Unlike other
              documents, these are not reviewed, serving as an unchangeable
              reference for each transaction&apos;s details.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#view_document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              View Document
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              This section is where you set out your high level business
              purpose, and your corporate values. Setting a clear vision,
              mission, and values helps align your direction, guide
              decision-making, differentiate yourself, attract talent, and build
              trust with stakeholders. It provides a roadmap for success,
              fostering unity, and ensuring that actions are in line with the
              business purpose and principles.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const registerSteps = [
    {
      target: "#row0",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Registers
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              The platform organises corporate registers into eight key
              categories for managing critical information. Regular review of
              documents, especially Governing Documents, is advised to ensure
              relevance. The platform aids this by automatically adding
              reviewable items to the governance timetable, ensuring a
              structured approach to document management.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#add_document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Resolutions Register
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Adding a member&apos;s resolution to the platform involves an
              embedded process that ensures comprehensive governance compliance.
              A member&apos;s resolution is a formal decision made by the
              shareholders (or members) of a company, often related to
              significant matters that require their consent, such as amendments
              to the company&apos;s constitution, approval of significant
              transactions, or changes in corporate structure.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#view_document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              View document
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              The platform&apos;s process for adding a member&apos;s resolution
              includes steps for obtaining board approval, followed by the
              necessary approval from the members. This dual-layered approval
              mechanism ensures that all decisions are made in accordance with
              corporate governance standards and the company&apos;s bylaws.
              After obtaining the required approvals, the platform prompts the
              relevant filing procedures, helping to record the resolution in
              line with legal requirements. This streamlined process not only
              helps with compliance with regulatory obligations but also
              maintains transparency and accountability within the
              company&apos;s governance framework.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const dataRoomSteps = [
    {
      target: "#row0",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 1
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To get started with SEEIO, you can upload your core governance
              data in to the system. This will automatically build your
              governance timetable and the system will send you reminders on
              core governance tasks. Some documents need to be reviewed
              regularly by the board and these will be automatically added to
              the board agendas.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#access_permissions",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 2
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To update the access of the users, simply click on this button.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#change-status",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 3
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Once you start working on a section, mark it as in progress and when you have completed a section, change the label to &quot;Ready&quot;. The overall status of the data room will automatically update when you set the status here to either &quot;In progress&quot; or &quot;ready&quot;.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const objectiveModalSteps = [
    {
      target: "#step1",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 1
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Select an objective category. If the present set categories do not
              fit your needs, select “define your own” from the bottom of the
              list. Objective category is displayed in the objectives table and
              makes it easier to find the relevant objective later
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step2",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 2
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Last review date is the date when this objective was last approved
              (typically by the board) and is used to calculate the next review
              (when the objective will next be added to a board meeting agenda).
              Leave this blank if you have not previously discussed this
              objective as a board and it will be added to the next board
              meeting. Tip: dont worry too much if this is something that you
              have been working on for some time - just choose a date in the
              past so that you even out the discussions in board meetings.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step3",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 3
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Review frequency is the frequency at which you want the objective
              to be reviewed. Typically choose 6 months here but some objectives
              will merrit a more frequent review.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step4",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 4
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Write a description of your objective. This is where you would
              enter the SMART description (specific, measurable, appropriate,
              realistic and time bound)
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step5",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 5
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Each Key indicator will have a type - either qualative (a
              descriptive measure) or quantitive (numerric, currency etc). Tip,
              keep these qualative unless you have identified specific metrics
              (e.g. monthly active users).
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step6",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 6
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Each key indicator is given an owner, Set the owner as the person
              who you want to to complete the progress update for each board
              report.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step7",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 7
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Set the status of the indicator (not started, in progress,
              completed etc.)
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step8",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 8
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              The frequency is the frequency of the results for the key
              indicator. This is only visible if you select a quantitive key
              indicator
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#step9",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 9
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Enter a description of the Key indicator together with is name.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const documentLevelDataRoomSteps = [
    {
      target: "#row0",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 1
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To access an underlying record, simply click on the name and the
              underlying data will be displayed in a card. You are able to
              upload document by clicking the arrow top right next to the bin
              icon and you can also download documents and delete entire
              records.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#change-status",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 2
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              Once a record has been updated, change the status so that you can
              see what is done and what is left to do.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#add_document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 3
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To add a new document, click the Add document here.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const viewDocumentDataRoomSteps = [
    {
      target: "#edit-document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 1
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To edit a record, click the pen icon.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#upload-document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 2
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To upload a document, click the up arrow. You can upload as many
              related documents as you like. To download a document, click the
              down arrow.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: "#delete-document",
      content: (
        <>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="#6FC6A5"
            trailColor="#6fc6a545"
          />
          <Space size={10} />
          <FlexBox flexDirection="column" alignItems="flex-start">
            <Typography size="huge" bold serif>
              Step 3
            </Typography>
            <Space size={10} />
            <Typography size="large" serif className={styles.text_align}>
              To delete a record, click on the bin icon.
            </Typography>
          </FlexBox>
        </>
      ),
      disableBeacon: true,
      hideCloseButton: true,
    },
  ];

  const handleCallback = (data: any) => {
    const { index } = data;
    if (
      data?.action === "skip" ||
      (data?.action === "next" &&
        data?.index === 6 &&
        data?.lifecycle === "complete")
    ) {
      dispatch(setConfig(false));
    }
    if (
      data?.action !== "skip" &&
      data?.action !== "close" &&
      data?.lifecycle === "complete"
    ) {
      if (data?.index === 0) {
        router.push("/dashboard/business-health/vision-purpose");
      } else if (data?.index === 3) {
        router.push(`/dashboard/business-health/corporate-objectives`);
      } else if (data?.index === 4) {
        router.push(`/dashboard/business-health/strategic-risks`);
      }
    }

    setCustomStepIndex(index + 1);
  };

  const registerHandleCallback = (data: any) => {
    const { index } = data;
    if (
      data?.action === "skip" ||
      (data?.action === "next" &&
        data?.index === 2 &&
        data?.lifecycle === "complete")
    ) {
      dispatch(setConfig(false));
    }

    if (
      data?.action !== "skip" &&
      data?.action !== "close" &&
      data?.lifecycle === "complete"
    ) {
      if (data?.index === 1) {
        if (onRouteChange) {
          router.push(onRouteChange as any);
          if (setBreadcrumbs) {
            setBreadcrumbs();
          }
        }
      }
    }
    setCustomStepIndex(index + 1);
  };

  const recordCallback = (data: any) => {
    const { index } = data;
    if (
      data?.action === "skip" ||
      (data?.action === "next" &&
        data?.index === 4 &&
        data?.lifecycle === "complete")
    ) {
      dispatch(setConfig(false));
    }
    if (
      data?.action !== "skip" &&
      data?.action !== "close" &&
      data?.lifecycle === "complete"
    ) {
      setCompletedSteps([...completedSteps, recordSteps?.[index]?.target]);
      if (data?.index === 3) {
        if (onRouteChange) {
          router.push(onRouteChange as any);
          if (setBreadcrumbs) {
            setBreadcrumbs();
          }
        }
      }
    }

    setCustomStepIndex(index + 1);
  };

  const sharedCallback = (data: any) => {
    const { index } = data;
    setCustomStepIndex(index + 1);
  };

  const getStep = useMemo(() => {
    let currentStep, callback;
    if (onGoingStep === DATA_ROOM_STEPS.DATA_ROOM) {
      currentStep = dataRoomSteps;
      callback = sharedCallback;
    } else if (onGoingStep === DATA_ROOM_STEPS.DOCUMENT_LEVEL) {
      currentStep = documentLevelDataRoomSteps;
      callback = sharedCallback;
    } else if (onGoingStep === DATA_ROOM_STEPS.VIEW_DOCUMENT) {
      currentStep = viewDocumentDataRoomSteps;
      callback = sharedCallback;
    } else if (onGoingStep === DATA_ROOM_STEPS.ADD_OBJECTIVE) {
      currentStep = objectiveModalSteps;
      callback = sharedCallback;
    } else if (pathName?.includes("business-health")) {
      currentStep = steps;
      callback = handleCallback;
    } else if (pathName?.includes("records")) {
      currentStep = recordSteps;
      callback = recordCallback;
    } else {
      currentStep = registerSteps;
      callback = registerHandleCallback;
    }
    return { currentStep, callback };
  }, [
    steps,
    recordSteps,
    registerSteps,
    dataRoomSteps,
    documentLevelDataRoomSteps,
    viewDocumentDataRoomSteps,
    objectiveModalSteps,
    start,
  ]);

  return (
    <Joyride
      steps={getStep?.currentStep}
      run={start}
      disableOverlayClose
      continuous={true}
      hideBackButton
      scrollToFirstStep={false}
      callback={getStep?.callback}
      showSkipButton={true}
      locale={{
        last: "Done",
      }}
      styles={{
        options: {
          zIndex: 1100,
          arrowColor: "#00293f",
          backgroundColor: "#00293f",
          primaryColor: "#9ec23b",
          textColor: "#fff",
          width: "550px",
        },
        buttonNext: {
          outline: "none",
        },
      }}
    />
  );
};

export default TourComponent;
