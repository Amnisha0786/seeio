'use client'

import {
  useState,
  useContext,
  Fragment,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'

import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Accordion from '@/components/accordion'
import Icon from '@/components/icon'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import AddButton from '@/components/add-button'
import { useSelectedAccountCompany } from '@/hooks'
import Card from '@/components/card'
import { TAction, TMeetingDetailsAgendaCategory, TMeetingDetailsTopic } from '@/models'
import * as API from '@/api'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import variables from "@/theme/variables.module.scss";
import ActionFromModal from './action-from-modal'
import AddOptionalTopicsModal from './add-optional-topics-modal'
import AddActionModal from '../../../add-action-modal'
import Loading from '@/components/loading'
import ConfirmDelete from '@/shared/confirm-delete'
import Toast from '@/components/toast'
import SharedFormModal, { IOptions } from './form-modals/shared-form-modal'
import { MAIN_HEADING } from './form-modals/form-modal-types'
import { MEETING_TYPE } from '@/constants'

interface TopicProps {
  openTopic: string | null;
  setOpenTopic: (value: string | null) => void;
  topic: TMeetingDetailsTopic;
  onSave: (values: any) => void;
  deleteTopic: () => void
  deletingTopic: boolean;
  onActionSuccess: () => void
  meetingType?: string
}

const Topic = ({ openTopic, setOpenTopic, topic, onSave, deleteTopic, deletingTopic, onActionSuccess, meetingType }: TopicProps) => {
  const deleteTopicModelRef: any = useRef()

  const openFormModalRef: any = useRef()
  const topicModalProps = {
    open: topic.topicType === openTopic,
    onCancel: () => setOpenTopic(null),
    onSave: (values: any) => {
      onSave(values)
      setOpenTopic(null)
    },
    topic,
  }

  return (
    <FlexBox flexDirection='column'>
      <Space size={24} />
      <Clickable onClick={() => setOpenTopic(topic.topicType)}>
        <Card paddingHorizontal={24} paddingVertical={22}>
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>{topic.topicName}</Typography>
            <FlexBox alignItems='center'>
              {topic.timeAlloted ? (
                <>
                  <Typography>
                    Alloted time: {topic.timeAlloted} minutes
                  </Typography>
                  <Space horizontal size={20} />
                  <Clickable onClick={() => openFormModalRef.current.open()}>
                    <Icon name='edit' color={variables.primaryColor} size={24} />
                  </Clickable>
                  <Space horizontal size={5} />
                  <Clickable onClick={() => deleteTopicModelRef.current.open()}>
                    <Icon name="delete-icon" className={styles.deleteIcon} size={24} />
                  </Clickable>
                </>
              ) : (
                <AddButton onClick={() => openFormModalRef.current.open()} />
              )}
            </FlexBox>
          </FlexBox>
        </Card>
      </Clickable>
      <SharedFormModal ref={openFormModalRef} topic={topic} onActionSuccess={onActionSuccess} meetingType={meetingType} />
      <ConfirmDelete
        ref={deleteTopicModelRef}
        handleConfirm={() => deleteTopic()}
        loading={deletingTopic}
      />
      {topic.topicType === 'action_from' && (
        <ActionFromModal {...topicModalProps} />
      )}
    </FlexBox>
  )
}

const Page = () => {
  const { meetingDetails, setMeetingDetails, loadMeetingDetails } = useContext(MeetingDetailsContext);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [actions, setActions] = useState<TAction[]>([]);
  const [initingActions, setInitingActions] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [actionToDelete, setActionToDelete] = useState('');
  const [deletingTopic, setDeletingTopic] = useState(false)
  const [topicItemOptions, setTopicItemOptions] = useState<IOptions[]>()


  const companyId = useSelectedAccountCompany()?.companyId
  const addOptionalTopicsModalRef = useRef<any>()
  const addActionModalRef = useRef<any>()
  const editActionModalRef = useRef<any>()
  const deleteModelRef: any = useRef()
  const params = useParams()
  const router = useRouter();
  const [saving, setSaving] = useState(false)
  
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
 

  const onSaveTopic = async (
    categoryId: string,
    topicId: string,
    topicType: string,
    values: any
  ) => {
    try {
      if (!companyId || !meetingDetails?.id) return

      await API.updateTopic({
        companyId,
        meetingId: meetingDetails.id,
        categoryId,
        topicId,
        topicType,
        updateAttributes: values,
      });
    } catch (e) { }
  };

  const fetchActionItemOptions = useCallback(async () => {

    if (!companyId || !meetingDetails?.id) return

    try {
      const response = await API.getAllAgendaTopics({
        companyId,
        meetingId: meetingDetails.id,
      })

      const options: IOptions[] = [];
      if (response && response?.length > 0) {
        response?.forEach((topicItem: TMeetingDetailsTopic) => {
          options.push({ label: topicItem?.topicName, value: topicItem?.topicId, agendaId: topicItem?.categoryId })
        })
        setTopicItemOptions(options)
      }
    } catch (error: any) {
      Toast.error(error?.message || 'Something went wrong.')
    }

  }, [companyId, meetingDetails?.id])

  useEffect(() => {
    fetchActionItemOptions()
  }, [fetchActionItemOptions])

  const deleteTopic = useCallback(async (
    categoryId: string,
    topicId: string,
  ) => {
    try {
      setDeletingTopic(true)
      if (!companyId || !meetingDetails?.id) return

      await API.deleteTopic({
        companyId,
        meetingId: meetingDetails.id,
        categoryId,
        topicId
      })

      await loadMeetingDetails()
      Toast.success('Delete topic successfully')
    } catch (err: any) {
      Toast.error(err?.message || 'Something went wrong.')
    } finally {
      setDeletingTopic(false)
    }
  }, [companyId, loadMeetingDetails, meetingDetails?.id])

  const fetchActionData = useCallback(async () => {
    setInitingActions(true)

    try {
      if (!companyId) return

      const result = await API.getActions({
        companyId,
        linkType: 'company',
        meetingId: params?.meetingId as string,
      })
      setActions(result)
    } finally {
      setInitingActions(false)
    }
  }, [companyId])

  useEffect(() => {
    fetchActionData()
  }, [fetchActionData])

  const onActionSuccess = () => {
    fetchActionData()
  }

  const deleteAction = async () => {
    try {
      setDeleting(true)
      if (!companyId || !actionToDelete) return
      await API.deleteAction({ companyId, actionId: actionToDelete })
      fetchActionData()
    } catch (err: any) {
      Toast.error(err.message || 'Something went wrong.')
    } finally {
      setDeleting(false)
      deleteModelRef?.current?.close()
    }
  }

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

  if (!meetingDetails) return null


  return (
    <>
      <FlexBox flexDirection='column' className={styles.page}>
        <FlexBox justifyContent="space-between">
          <Typography size='giant'>During meeting</Typography>
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
                        category.timeAlloted && (
                          <Typography>
                            Alloted time: {category.timeAlloted} minutes
                          </Typography>
                        )
                      }
                    >
                      <Droppable droppableId={category.categoryId} type="TOPIC">
                        {(provided: DroppableProvided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {category.topics?.length == 0 ?
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
                                      <Topic
                                        key={topic.topicId}
                                        openTopic={openTopic}
                                        onActionSuccess={onActionSuccess}
                                        setOpenTopic={setOpenTopic}
                                        topic={topic}
                                        deleteTopic={() =>
                                          deleteTopic(category.categoryId,
                                            topic.topicId)}
                                        deletingTopic={deletingTopic}
                                        meetingType={meetingDetails?.type}
                                        onSave={(values) =>
                                          onSaveTopic(
                                            category.categoryId,
                                            topic.topicId,
                                            topic.topicType,
                                            values
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Space size={24} />
                      <FlexBox justifyContent='flex-end'gap={5}>
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
                            addOptionalTopicsModalRef.current.open(
                              category.categoryId
                            )
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
        <AddOptionalTopicsModal ref={addOptionalTopicsModalRef} />
      </FlexBox>

      <Space size={24} />
      <FlexBox justifyContent='flex-end'>
        <Button onClick={() => addActionModalRef.current.open()}>
          Add action
        </Button>
      </FlexBox>
      <Space size={24} />
      <FlexBox flexDirection='column' className={styles.page}>
        <Typography size='giant'>Actions</Typography>
        <Space size={24} />
        {initingActions ? (
          <Loading size='small' />
        ) : (
          actions.map((action, index) => (
            <>
              <Fragment key={index}>
                <div className={styles.border}>
                  <FlexBox justifyContent='space-between'>
                    <Typography className={styles.bolder} size='large'>
                      Action {index + 1}
                    </Typography>
                    <FlexBox>
                      <Clickable
                        onClick={() => editActionModalRef.current.open(action)}
                      >
                        <Icon name='edit-icon' size={24} />
                      </Clickable>
                      <Space size={20} horizontal />
                      <Clickable
                        onClick={() => {
                          deleteModelRef.current.open()
                          setActionToDelete(action.id)
                        }}
                      >
                        <Icon name='red-delete-icon' size={24} />
                      </Clickable>
                    </FlexBox>
                  </FlexBox>
                  <Accordion
                    className={styles.neutral}
                    title={action.name}
                    middle={{
                      text1: `Due Date : ${dayjs(action.dueDate).format(
                        'DD/MM/YYYY'
                      )}`,
                      text2: `${action?.owner?.firstName} ${action?.owner?.lastName}`,
                    }}
                  >
                    <Space size={18} />
                    <FlexBox>
                      <Typography size='large'>{action?.description}</Typography>
                    </FlexBox>
                  </Accordion>
                </div>
              </Fragment>
              <Space size={24} />
            </>
          ))
        )}
      </FlexBox>
      <AddActionModal
        ref={addActionModalRef}
        onSuccess={onActionSuccess}
        meetingId={meetingDetails.id}
        topicOptions={topicItemOptions}
      />
      <AddActionModal
        isEdit={true}
        ref={editActionModalRef}
        onSuccess={onActionSuccess}
        meetingId={meetingDetails.id}
        topicOptions={topicItemOptions}
      />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteAction}
        loading={deleting}
        message={'Are you sure you want to delete the action?'}
      />
    </>
  )
}

export default Page
