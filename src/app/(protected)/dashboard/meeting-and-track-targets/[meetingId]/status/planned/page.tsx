"use client";

import { useState, useContext, Fragment, useRef, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useRouter } from "next/navigation";

import Space from "@/components/space";
import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import Accordion from "@/components/accordion";
import Icon from "@/components/icon";
import Typography from "@/components/typography";
import Toast from "@/components/toast";
import Clickable from "@/components/clickable";
import { useSelectedAccountCompany } from "@/hooks";
import Card from "@/components/card";
import { TMeetingDetailsTopic, TMeetingDetailsAgendaCategory } from "@/models";
import * as API from "@/api";
import variables from "@/theme/variables.module.scss";
import { MeetingDetailsContext } from "../../context";
import styles from "./page.module.scss";
import ApprovalOfPreviousMinutesModal from "./approval-of-previous-minutes-modal";
import ProgressAgainstActionsModal from "./progress-against-actions-modal";
import AdditionalActionItemModal from "./additional-action-item-modal";
import RisksForReviewModal from "./risks-for-review-modal";
import HorizonPlanningModal from "./horizon-planning-modal";
import ProgressAgainstObjectivesModal from "./progress-against-objectives-modal";
import AdditionalTopicModal from "./additional-topic-modal";
import AddInformationItemModal from "./add-information-item-modal";
import ConfirmDelete from '@/shared/confirm-delete';
import ForReviewOrApprovalModal from "./for-review-or-approval-modal";
import ChairsIntroductionModal from "./chairs-introduction";
import AttendeesConflictsModal from "./attendees-conflicts-modal";
import ComplaintsIncidentModal from './complaints-incidents-modal';
import { MEETING_TYPE } from "@/constants"
import { MAIN_HEADING } from "../started/form-modals/form-modal-types"

interface TopicProps {
  topic: TMeetingDetailsTopic;
  meetingType?: string
}

const Topic = ({ topic, meetingType }: TopicProps) => {
  const [open, setOpen] = useState(false);

  const { deleteTopic, deleting } = useContext(MeetingDetailsContext);

  const deleteModelRef = useRef<any>();

  const topicModalProps = {
    open,
    onCancel: () => setOpen(false),
    topic,
  };

  const onDelete = async () => {
    deleteTopic(topic)
    setOpen(false)
  }

  return (
    <FlexBox flexDirection='column'>
      <Space size={24} />
      <Clickable onClick={() => setOpen(true)}>
        <Card paddingHorizontal={24} paddingVertical={22}>
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>{topic.topicName}</Typography>
            <FlexBox alignItems='center'>
              <Typography>
                Alloted time: {topic.timeAlloted || 0} minutes
              </Typography>
              <Space horizontal size={20} />
              <Icon name='edit' color={variables.primaryColor} size={24} />
              <Space horizontal size={5} />
              <Clickable
                onClick={(e) => {
                  e.stopPropagation()
                  deleteModelRef.current.open()
                }}
              >
                <Icon
                  name='delete-icon'
                  className={styles.deleteIcon}
                  size={24}
                />
              </Clickable>
            </FlexBox>
          </FlexBox>
        </Card>
      </Clickable>
      {topic.topicType === 'approval_of_previous_minutes' && (
        <ApprovalOfPreviousMinutesModal {...topicModalProps} />
      )}
      {topic.topicType === 'progres_against_actions' && (
        <ProgressAgainstActionsModal {...topicModalProps} />
      )}
      {topic.topicType === 'optional_action_item' && (
        <AdditionalActionItemModal {...topicModalProps} />
      )}
      {topic.topicType === 'risks_for_review' && (
        <RisksForReviewModal {...topicModalProps} />
      )}
      {topic.topicType === 'horizon_planning' && (
        <HorizonPlanningModal {...topicModalProps} />
      )}
      {topic.topicType === 'progress_against_objectives' && (
        <ProgressAgainstObjectivesModal {...topicModalProps} />
      )}
      {topic.topicType === 'additional_information_item' && (
        <AddInformationItemModal {...topicModalProps} />
      )}
      {topic.topicType === 'additional_topic' && (
        <AdditionalTopicModal {...topicModalProps} />
      )}
      {topic.topicType === 'complaints_and_or_incidents' && (
        <ComplaintsIncidentModal {...topicModalProps} />
      )}
      {(topic.topicType === 'for_review_or_approval' ||
        topic.topicType === 'objective_for_review' ||
        topic.topicType === 'record_for_review' ||
        topic.topicType === 'register_for_review') && (
        <ForReviewOrApprovalModal {...topicModalProps} />
      )}
      {topic.topicType === 'chairs_introduction_and_opening' && (
        <ChairsIntroductionModal {...topicModalProps} />
      )}
      {topic.topicType === 'attendees_and_conflicts_of_interest' && (
        <AttendeesConflictsModal {...topicModalProps} meetingType={meetingType} />
      )}

      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={onDelete}
        loading={deleting}
        message={'Are you sure you want to delete the action?'}
      />
    </FlexBox>
  )
};

const Page = () => {
  const { meetingDetails, setMeetingDetails } = useContext(
    MeetingDetailsContext
  );
  const [saving, setSaving] = useState(false)
  const [createAdditionalTopicCategoryId, setCreateAdditionalTopicCategoryId] =
    useState<string | null>(null);
  const companyId = useSelectedAccountCompany()?.companyId;
  const router = useRouter();
  
  const saveTemplate =  useCallback(async (topicIds:string[], agendaId:string) => {
    if(!companyId || !meetingDetails){
      return
    }
    try {
      setSaving(true)
      const response = await API.saveTemplate({
        companyId :companyId,
        meetingId: meetingDetails?.id,
        agendaId,
        topicIds,
      })
      if(response){
        Toast.success(response?.message || "Successfully saved as agenda template")
        setSaving(false)
      }
    } 
    catch (error:any) {
      Toast.error(error?.message || 'Something went wrong')
      setSaving(false)
      
    }
  }, [meetingDetails,meetingDetails])
 

  const onCategoryDragEnd = async (result: DropResult) => {

    if (!result.destination) {
      return;
    }
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index) {
      return;
    }
    try {
      if (!companyId || !meetingDetails?.id) return;

      const categoryDetails: TMeetingDetailsAgendaCategory | undefined = meetingDetails.agenda.find(
        (category) => category.categoryId === result.source.droppableId
      );
      const categoryDetailsOfDestination: TMeetingDetailsAgendaCategory | undefined = meetingDetails.agenda.find(
        (category) => category.categoryId === result?.destination?.droppableId
      );
      if (categoryDetails) {
        const sortedTopics = Array.from(categoryDetails.topics);
        const [removed] = sortedTopics.splice(result.source.index, 1);
        if (result.source.droppableId === result.destination.droppableId) {

          sortedTopics.splice(result.destination.index, 0, removed);

          if (meetingDetails) {

            const sortedCategories = meetingDetails.agenda.map((item) =>
              item.categoryId === categoryDetails.categoryId
                ? { ...item, topics: sortedTopics }
                : item
            );

            setMeetingDetails({
              ...meetingDetails,
              agenda: sortedCategories,
            });

            await API.updateCategory({
              companyId,
              meetingId: meetingDetails.id,
              categoryId: categoryDetails.categoryId,
              topicOrderIds: sortedTopics.map((item) => item.topicId),
            });

          }
        } else {
          if (categoryDetailsOfDestination) {
            const sortedTopicsForCategory = Array.from(categoryDetailsOfDestination?.topics || []);
            sortedTopicsForCategory.splice(sortedTopicsForCategory?.length, 0, removed);
            const sortedCategories = meetingDetails.agenda.map((item) => {
              if (item.categoryId === categoryDetailsOfDestination?.categoryId) {
                return { ...item, topics: sortedTopicsForCategory, topicOrderIds: sortedTopicsForCategory.map((item) => item.topicId) }
              }
              if (item.categoryId === categoryDetails?.categoryId) {
                return { ...item, topics: sortedTopics, topicOrderIds: sortedTopics.map((item) => item.topicId) }
              } else {
                return item;
              }
            }
            );

            setMeetingDetails({
              ...meetingDetails,
              agenda: sortedCategories,
            });

            await API.updateTopicCategory({
              companyId,
              meetingId: meetingDetails.id,
              topicId: result.draggableId,
              moveAgenda: {
                fromId: result.source.droppableId,
                toId: result.destination.droppableId
              }
            });
          }
        }
        Toast.success("Re-order categories successfully");
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
    }
  }

  if (!meetingDetails) return null;


  return (
    <>
      <FlexBox flexDirection="column" className={styles.page}>
        <FlexBox justifyContent="space-between">
          <Typography size="giant">Manage agenda</Typography>
          <Button
            onClick={() =>
              router.push(
                `/dashboard/meeting-and-track-targets/${meetingDetails.id}/meeting-pack`
              )
            }
          >
            View Meeting Pack
          </Button>
        </FlexBox>
        <Space size={24} />
        <DragDropContext onDragEnd={(result) => onCategoryDragEnd(result)}>
          <Droppable droppableId="categories" direction="vertical" type="CATEGORY">
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>

                {meetingDetails.agenda.map((category) => (
                  <Fragment key={category.categoryId}>
                    <Accordion
                      title={category.categoryName}
                      right={
                        <Typography>
                          Alloted time: {category.timeAlloted} minutes
                        </Typography>
                      }
                    >
                      <Droppable droppableId={category.categoryId} type="TOPIC">
                        {(provided: DroppableProvided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {category?.topics?.length == 0 ?
                              <><Space size={20} /><Typography gray center>{"  "}</Typography></>
                              : category.topics.map((topic, index) => (
                                <Draggable
                                  key={topic.topicId}
                                  draggableId={topic.topicId}
                                  index={index}
                                >

                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Topic key={topic.topicId} topic={topic} meetingType={meetingDetails?.type} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <Space size={24} />
                      <FlexBox justifyContent="flex-end" gap={5}>
                        {(category?.topics?.length > 0 && (category?.categoryName === MAIN_HEADING.DISCUSSION && meetingDetails?.type === MEETING_TYPE.MANAGEMENT)) && <Button
                          type='primary'
                          onClick={() =>
                            saveTemplate(category?.topics?.map((item)=> item?.topicId) , category.categoryId)
                          }
                          loading={saving}
                          disabled={saving}
                        >
                          Save as template
                        </Button>}

                        <Button
                          onClick={() =>
                            setCreateAdditionalTopicCategoryId(category.categoryId)
                          }
                        >
                          Add additional topic
                        </Button>
                      </FlexBox>
                    </Accordion>
                    <Space size={24} />
                  </Fragment>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AdditionalTopicModal
          open={!!createAdditionalTopicCategoryId}
          categoryId={createAdditionalTopicCategoryId || ""}
          onCancel={() => setCreateAdditionalTopicCategoryId(null)}
        />
      </FlexBox>
    </>
  );
};

export default Page;
