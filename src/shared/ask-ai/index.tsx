import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormik } from "formik";
import { Badge, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as XLSX from 'xlsx'
import * as yup from 'yup'
import { LoadingOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import { marked } from "marked";

import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import * as AIAPI from "@/api-ai";
import Typography from "@/components/typography";
import styles from "./ask-ai-modal.module.scss";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import Toast from "@/components/toast";
import AddButton from "@/components/add-button";
import { openUploadDialog } from "@/utils/file-reader";
import { usePathname } from "next/navigation"
import { TEXT_FOR_ASK_AI_OBJECTIVE_MODAL, TEXT_FOR_ASK_AI_RISK_MODAL, TEXT_FOR_ASK_AI_VISION_MODAL } from "@/constants"

interface Message {
  role: string;
  content: string;
}

interface ChatFormValues {
  message: string;
}

export interface ChatRisk {
  name: string;
  description: string;
  riskType: string;
  impact: number;
  probability: number;
  mitigations: any[];
  reviewFrequency?: number
  owner?: string
}

enum ChatTopics {
  VISION = "Vision & purpose",
  RISKS = "Risks",
  OBJECTIVES = "Objectives",
}

type TopicValues = `${ChatTopics}`;

const getContent = (topic?: TopicValues) => {
  if (topic === ChatTopics.RISKS) {
    return TEXT_FOR_ASK_AI_RISK_MODAL
  } else if (topic === ChatTopics.VISION) {
    return TEXT_FOR_ASK_AI_VISION_MODAL
  }
  return TEXT_FOR_ASK_AI_OBJECTIVE_MODAL
}


const AskAiModal = forwardRef(
  ({ collapse,
    setCollapse,
    userData,
    setUpdateData,
    fullHeight
  }: {
    collapse: boolean,
    setCollapse: () => void,
    userData: any,
    setUpdateData?: any
    fullHeight?: boolean
  }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicValues>();
    const [uploadedFile, setUploadedFile] = useState<string>("")
    const [isSendMessageLoading, setSendMessageLoading] =
      useState<boolean>(false);
    const pathname = usePathname()
    useEffect(() => {
      if (pathname === '/dashboard/business-health/strategic-risks') {
        setSelectedTopic(ChatTopics.RISKS)
      } else if (pathname === '/dashboard/business-health/vision-purpose') {
        setSelectedTopic(ChatTopics.VISION)
      } else if (pathname === '/dashboard/business-health/corporate-objectives') {
        setSelectedTopic(ChatTopics.OBJECTIVES)
      }
    }, [pathname])

    const [isInitialMessage, setIsInitialMessage] = useState<boolean>(true);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [typing, setTyping] = useState(false)

    const initial_chat = useMemo(() => ({
      chat_context: [
        { role: "system", content: "RISK_PROMPT" },
        {
          role: "assistant",
          content: getContent(selectedTopic)
        },
      ],
      risks: [],
    }), [selectedTopic]);

    useEffect(() => {
      // Filter out system messages and set messages
      const filteredMessages = initial_chat.chat_context.filter(
        (msg) => msg.role !== "system" && msg.role !== "tool" && (msg.content !== null || msg.content !== "")
      ); //Intial Chat
      setMessages(filteredMessages);
    }, [initial_chat]);

    marked.setOptions({
      breaks: false, // Adds <br> on single line breaks (if you need it)
      gfm: true, // Enables GitHub flavored markdown
    });

    // Scroll to the bottom of the chat on update
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const formik = useFormik<ChatFormValues>({
      enableReinitialize: true,
      validateOnChange: false,
      validateOnBlur: false,
      initialValues: {
        message: "",
      },
      validationSchema: yup.object({
        uploadedCsvFile: yup.string(),
        message: yup.string().when("uploadedCsvFile", {
          is: (val: any) => {
            return val;
          },
          then: (message) => message.notRequired(),
          otherwise: (message) => message.required("Please type your message"),
        }),
      }),

      onSubmit: async (values, { resetForm }) => {
        formik?.validateForm(values)
        setSendMessageLoading(true);
        setMessages([...messages, { role: "user", content: formik?.values?.message ? formik?.values?.message : "" + " " + uploadedFile }])
        setTyping(true)
        resetForm();
        try {
          setIsInitialMessage(true);
          if (selectedTopic === ChatTopics?.RISKS) {
            const response = await AIAPI.sendChatMessage(
              isInitialMessage ? {
                query: values.message || " ",
                csvAttachment: uploadedFile,
                isInitialMessage: true,
              } :
                {
                  query: values.message || " ",
                  csvAttachment: uploadedFile,
                  isInitialMessage: false,
                  chatContext: messages
                }
            );
            if (response?.newRisks?.length > 0) {
              setUpdateData(response?.newRisks?.map((item: any) => ({ ...item, id: uuidv4() })))
            }
            setMessages(response.chatContext);
            setTyping(false)

          } else if (selectedTopic === ChatTopics?.VISION) {
            const response = await AIAPI.sendVisionChatMessage(
              isInitialMessage ? {
                query: values.message || " ",
                csvAttachment: uploadedFile,
                isInitialMessage: true,
                userData: userData
              } :
                {
                  query: values.message || " ",
                  csvAttachment: uploadedFile,
                  isInitialMessage: false,
                  chatContext: messages
                }
            );
            setMessages(response.chatContext);
            if (response?.updateData) {
              setUpdateData(response.updateData)
            }
            setTyping(false)
          } else {
            const response = await AIAPI.sendObejectiveChatMessage(
              isInitialMessage ? {
                query: values.message || " ",
                csvAttachment: uploadedFile,
                isInitialMessage: true,
                userData: userData
              } :
                {
                  query: values.message || " ",
                  csvAttachment: uploadedFile,
                  isInitialMessage: false,
                  chatContext: messages
                }
            );
            if (response?.newObjectives?.length > 0) {
              setUpdateData(response?.newObjectives?.map((item: any) => ({ ...item, id: uuidv4() })))
            }
            setMessages(response.chatContext);
            setTyping(false)
          }
          resetForm(); // Reset the form after successful submission
          setUploadedFile("")
        } catch (e: any) {
          Toast.error(e.message || "Something went wrong.");
        } finally {
          setSendMessageLoading(false);
          setIsInitialMessage(false);
          setTyping(false)
        }
      },
    });


    const onUpload = async () => {
      const files = await openUploadDialog(".xlsx, .xls, .csv");
      const reader = new FileReader();
      if (files?.length > 0) {
        reader.readAsArrayBuffer(files?.[0]);
        reader.onload = async (event) => {
          const wb = XLSX.read(event?.target?.result);
          const sheets = wb.SheetNames;
          if (sheets?.length) {
            const rows = XLSX?.utils.sheet_to_csv(wb.Sheets[sheets[0]]);
            setUploadedFile(rows)
            formik.setFieldValue("uploadedCsvFile", rows)
          }
        };
      }
    };

    return (
      <div
        className={`${styles.modal} ${fullHeight ? styles.fullHeight : ""} ${!collapse ? styles.collapseAiModal : ""}`}
      >
        <div className={styles.container}>
          <FlexBox flexDirection="column" alignItems={"center"}>
            <FlexBox
              justifyContent="space-between"
              alignItems={"center"}
              className={styles.header}
            >
              <FlexBox alignItems="center" >
                <Clickable onClick={() => {
                  setCollapse()
                }} className={styles.drawerIcon}>

                  <Icon name='drawer-icon' size={13} />
                </Clickable>
                <Space horizontal size={24} />

                <Icon name="ask-ai" size={40} />{" "}
                <Typography size="big" className={styles.textColor}>
                  Ask AI
                </Typography>

                <Space horizontal size={10} />
                {selectedTopic && (
                  <div className={styles.badge}>
                    <FlexBox alignItems="center" justifyContent="center">
                      <Typography className={styles.color}>
                        {selectedTopic}
                      </Typography>
                    </FlexBox>
                  </div>
                )}
              </FlexBox>

            </FlexBox>
          </FlexBox>
        </div>

        <div className={styles.main}>
          {" "}
          {selectedTopic ? (
            messages
              .filter((msg) => msg.role !== "system" && msg.role !== "tool" && msg.content !== null && msg.content !== "")
              .map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.message} ${msg.role === "user"
                      ? styles.userMessage
                      : styles.assistantMessage
                    }`}
                  >
                    <Typography
                      className={styles.typography}
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                    />
                  </div>
                );
              })
          ) : (
            <div className={styles.welcomeContent}>
              <FlexBox
                flexDirection="column"
                alignItems={"center"}
                justifyContent="center"
                className={styles.padding}
              >
                <Icon name="ask-ai" size={54} />
                <Typography size="extraLarge">
                  Get setup with AI assistance
                </Typography>
                <Typography gray size="big" center>
                  Before asking a question please select a topic
                </Typography>
              </FlexBox>
              <div className={styles.buttonGroup}>
                <Button
                  className={`${selectedTopic === ChatTopics.VISION
                    ? styles?.selected
                    : styles?.unselected
                  } ${styles.btnWidth}`}
                  onClick={() => setSelectedTopic(ChatTopics.VISION)}
                >
                  {ChatTopics.VISION}
                </Button>
                <Space size={10} />
                <FlexBox gap={10}>
                  <Button
                    className={`${selectedTopic === ChatTopics.RISKS
                      ? styles?.selected
                      : styles?.unselected
                    } ${styles.btnWidth}`}
                    onClick={() => setSelectedTopic(ChatTopics.RISKS)}
                  >
                    {ChatTopics.RISKS}
                  </Button>
                  <Button
                    className={`${selectedTopic === ChatTopics.OBJECTIVES
                      ? styles?.selected
                      : styles?.unselected
                    } ${styles.btnWidth}`}
                    onClick={() => setSelectedTopic(ChatTopics.OBJECTIVES)}
                  >
                    {ChatTopics.OBJECTIVES}
                  </Button>
                </FlexBox>
              </div>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>
        {selectedTopic && <div className={styles.footer}>
          <FlexBox alignItems="center">
            {typing && <img src="/icons/messageLoading.gif" />}
          </FlexBox>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.relative}>
              <TextArea
                autoSize={false}
                id="message"
                name="message"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className={styles.chatInput}
                placeholder="Type your message here..."
                onKeyPress={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !formik.isSubmitting) {
                    formik.handleSubmit();
                  }
                }}
              />
              {
                (selectedTopic === ChatTopics.RISKS || selectedTopic === ChatTopics.OBJECTIVES) && <>
                  {uploadedFile?.length !== 0 ?
                    <div onClick={() => {
                      setUploadedFile("")
                      formik.setFieldValue("uploadedCsvFile", "")
                    }}>
                      <Badge count={"x"} title="Remove uploaded file" className={styles.fileBadge}>
                        <div className={styles.files} onClick={(e) => e.stopPropagation()}>{"1"}</div>
                      </Badge>
                    </div>
                    :
                    <>
                      <AddButton className={styles.plusIcon} onClick={onUpload} />
                    </>}
                </>
              }
              <Clickable
                className={styles.submitBtn}
                onClick={() => {
                  if (!formik?.isSubmitting) {
                    formik.handleSubmit();
                  }
                }}
              >
                {isSendMessageLoading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 18 }} spin />
                    }
                  />
                ) : (
                  <Icon
                    name="send-icon"
                    size={24}
                  />
                )}
              </Clickable>
            </div>
            {formik.errors.message ? (
              <Typography red size="small">{formik.errors.message}</Typography>
            ) : null}
          </form>
        </div>}
      </div>
    );
  }
);

AskAiModal.displayName = "AskAiModal";

export default AskAiModal;
