/* eslint-disable max-len */
"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import FlexBox from '@/components/flex-box';
import Container from '@/components/container';
import ScollablePage from '@/components/scollable-page';
import Space from '@/components/space';
import Typography from '@/components/typography';
import { useFormik } from 'formik';
import Toast from '@/components/toast';
import * as AIAPI from '@/api-ai';
import { Input } from 'antd';
import Button from '@/components/button';

interface Props {
  params: {
    companyNumber: string;
  };
}

interface Message {
  role: string;
  content: string;
}

interface ChatFormValues {
    message: string;
}

interface ChatRisk {
  name: string;
  description: string;
  riskType: string;
  impact: number;
  probability: number;
  mitigations: any[];
}

const Page: React.FC<Props> = ({ params }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isSendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [isInitialMessage, setIsInitialMessage] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  
  const initial_chat = {
    chat_context: [
      { role: 'system', content: 'RISK_PROMPT' },
      { role: 'assistant', content: "Let's get started setting up your risks in SEEIO. Can you please provide some details about the risks your business is currently facing?" },
    ],
    risks: []
  };


  const test_chat = {
    "chat_context": [
      {
        "role": "system",
        "content": "You are a bot helping a user set up their data in a UK board governance SaaS tool, SEEIO.\n    Your task is to chat with the user to come up with their business risks, formatted correctly for the platform.\n\n    # Instructions:\n    ## Risk Format:\n    Use <<<RISK>>> <<</RISK>>> tags to indicate the start and end of a risk. Only include correctly formatted compact JSON between these tags. Ensure no new lines, extra spaces, or formatting errors are present.\n\n    Each risk should be formatted as:\n    {\"name\": \"Name of the risk\", \"description\": \"Brief description of the risk in 1-2 sentences\", \"riskType\": \"Type of the risk\", \"impact\": numerical impact value, \"probability\": numerical probability value, \"mitigations\": [{\"name\": \"Name of mitigation strategy\", \"description\": \"Brief description of the mitigation in 1-2 sentences\", \"action\": \"Action to be taken in 1-2 sentences\"}]}\n\n    ## Interaction:\n    If the user's input lacks detailed information about any of the risk components, ask specific questions to gather necessary details such as the nature of the risks, their impacts, probabilities, and potential mitigation strategies.\n\n    If the input seems complete, summarize the risks and confirm with the user before proceeding.\n\n    RiskType possible values are: Brand Development, Corporate Culture, Cost Management, Customer Engagement, Data Protection, Environment, Social and Governance, Financial Stability, Headcount, Marketing, Product Development, Production Management, Regulation and Compliance, Research and Development, Sales Growth, Service Delivery, Service Development, Supply Chain Management, Team Management, Others\n\n    Based on the user's last message and previous conversation, decide whether to request more information or move forward.\n    "
      },
      {
        "role": "assistant",
        "content": "Let's get started setting up your risks in SEEIO. Can you please provide some details about the risks your business is currently facing?"
      },
      {
        "role": "user",
        "content": "We are a micro-influencer marketing SaaS business that helps brand and influencers connect.         We have a team of 10 employees and have been in operation for 2 years. We have a monthly revenue of $50,000 and are looking to expand our client base.`         Our main risks include high churn rate of influencers, legal issues due to non-compliance with regulations, and technical issues with the platform causing service interruptions.         We have implemented strategies to mitigate these risks, such as offering competitive rates to influencers, regularly reviewing and updating compliance policies, and employing robust QA processes.';     "
      },
      {
        "role": "assistant",
        "content": "Thank you for sharing the details about your business and the risks you're currently facing. To make sure I understand correctly, here's a summary of the risks and mitigation strategies you've mentioned:\n\n1. High churn rate of influencers:\n   - Mitigation: Offering competitive rates to influencers.\n\n2. Legal issues due to non-compliance with regulations:\n   - Mitigation: Regularly reviewing and updating compliance policies.\n\n3. Technical issues causing service interruptions:\n   - Mitigation: Employing robust QA processes.\n\nBefore we proceed, I'd like to confirm these details and gather some additional information. Could you please provide the following for each risk:\n\n- A brief description of the risk (1-2 sentences).\n- An estimated numerical impact value (1 being the lowest, 10 being the highest).\n- An estimated numerical probability value (1 being the lowest, 10 being the highest).\n- A brief description of the mitigation action (1-2 sentences).\n\nThis information will help us correctly format the risks for the SEEIO platform.",
        "tool_calls": null
      },
      {
        "role": "user",
        "content": "We are a micro-influencer marketing SaaS business that helps brand and influencers connect.         We have a team of 10 employees and have been in operation for 2 years. We have a monthly revenue of $50,000 and are looking to expand our client base.`         Our main risks include high churn rate of influencers, legal issues due to non-compliance with regulations, and technical issues with the platform causing service interruptions.         We have implemented strategies to mitigate these risks, such as offering competitive rates to influencers, regularly reviewing and updating compliance policies, and employing robust QA processes.';     "
      },
      {
        "role": "assistant",
        "content": "Based on the information provided, I've formatted the risks for the SEEIO platform as follows:\n\n1. High churn rate of influencers:\n\n<<<RISK>>>\"{\"name\": \"High Churn Rate of Influencers\", \"description\": \"Loss of influencers due to better opportunities or dissatisfaction with the platform\", \"riskType\": \"Customer Engagement\", \"impact\": 8, \"probability\": 7, \"mitigations\": [{\"name\": \"Competitive Rates\", \"description\": \"Offering attractive rates to influencers\", \"action\": \"Monitor market rates and adjust our offerings accordingly\"}]}\"<<</RISK>>>\n\n1. Legal issues due to non-compliance with regulations:\n\n<<<RISK>>>\"{\"name\": \"Legal Issues due to Non-compliance\", \"description\": \"Potential fines or penalties due to non-compliance with marketing or data protection regulations\", \"riskType\": \"Regulation and Compliance\", \"impact\": 9, \"probability\": 3, \"mitigations\": [{\"name\": \"Policy Updates\", \"description\": \"Regular review and updates to compliance policies\", \"action\": \"Schedule periodic reviews and update policies as needed\"}]}\"<<</RISK>>>\n\n1. Technical issues causing service interruptions:\n\n<<<RISK>>>\"{\"name\": \"Technical Issues causing Service Interruptions\", \"description\": \"Platform downtime or performance issues affecting user experience\", \"riskType\": \"Service Delivery\", \"impact\": 7, \"probability\": 6, \"mitigations\": [{\"name\": \"Robust QA Processes\", \"description\": \"Implementing thorough quality assurance processes\", \"action\": \"Regularly test and improve QA processes to minimize technical issues\"}]}\"<<</RISK>>>\n\nPlease review these formatted risks and let me know if any changes are needed. If they look accurate, we can proceed with setting them up in SEEIO.",
        "tool_calls": null
      },
      {
        "role": "user",
        "content": "We are a micro-influencer marketing SaaS business that helps brand and influencers connect.         We have a team of 10 employees and have been in operation for 2 years. We have a monthly revenue of $50,000 and are looking to expand our client base.`         Our main risks include high churn rate of influencers, legal issues due to non-compliance with regulations, and technical issues with the platform causing service interruptions.         We have implemented strategies to mitigate these risks, such as offering competitive rates to influencers, regularly reviewing and updating compliance policies, and employing robust QA processes.';     "
      },
      {
        "role": "assistant",
        "content": "Based on the information provided, I've formatted the risks for the SEEIO platform as follows:\n\n<<<RISK>>>\"{\"name\": \"High Churn Rate of Influencers\", \"description\": \"Loss of influencers due to better opportunities or dissatisfaction with the platform\", \"riskType\": \"Customer Engagement\", \"impact\": 8, \"probability\": 7, \"mitigations\": [{\"name\": \"Competitive Rates\", \"description\": \"Offering attractive rates to influencers\", \"action\": \"Monitor market rates and adjust our offerings accordingly\"}]}\"<<</RISK>>>\n\n<<<RISK>>>\"{\"name\": \"Legal Issues due to Non-compliance\", \"description\": \"Potential fines or penalties due to non-compliance with marketing or data protection regulations\", \"riskType\": \"Regulation and Compliance\", \"impact\": 9, \"probability\": 3, \"mitigations\": [{\"name\": \"Policy Updates\", \"description\": \"Regular review and updates to compliance policies\", \"action\": \"Schedule periodic reviews and update policies as needed\"}]}\"<<</RISK>>>\n\n<<<RISK>>>\"{\"name\": \"Technical Issues causing Service Interruptions\", \"description\": \"Platform downtime or performance issues affecting user experience\", \"riskType\": \"Service Delivery\", \"impact\": 7, \"probability\": 6, \"mitigations\": [{\"name\": \"Robust QA Processes\", \"description\": \"Implementing thorough quality assurance processes\", \"action\": \"Regularly test and improve QA processes to minimize technical issues\"}]}\"<<</RISK>>>\n\nPlease review these formatted risks and let me know if any changes are needed. If they look accurate, we can proceed with setting them up in SEEIO.",
        "tool_calls": null
      }
    ],
    "risks": []
  }

  useEffect(() => {
    // Filter out system messages and set messages
    // const filteredMessages = test_chat.chat_context.filter(msg => msg.role !== 'system'); //TEST Chat
    const filteredMessages = initial_chat.chat_context.filter(msg => msg.role !== 'system'); //Intial Chat
    setMessages(filteredMessages);
  }, []);

  const parseAndReplaceRisks = (content: string) => {
    const riskRegex = /<<<RISK>>>(.*?)<<<\/RISK>>>/gs;
    let match;
    const output = [];
    let lastIndex = 0;
  
    while ((match = riskRegex.exec(content)) !== null) {
      // Push text before the risk
      output.push(content.slice(lastIndex, match.index));
      // remove first and last character if it is ""
      if (match[1].charAt(0) === '"') {
        match[1] = match[1].slice(1, -1);
      }
      if (match[1].charAt(match[1].length - 1) === '"') {
        match[1] = match[1].slice(0, -1);
      }

      // Parse the risk JSON and create a RiskCard component
      const riskData = JSON.parse(match[1]);
      output.push('\n\n');
      output.push(<RiskCard key={match.index} risk={riskData} onSave={handleRiskSave} />);
      lastIndex = match.index + match[0].length;
    }
  
    // Push remaining text after the last risk
    output.push(content.slice(lastIndex));
    return output;
  };

  const handleRiskSave = (risk: ChatRisk) => {
    // Implement saving logic here, perhaps updating state or calling an API
  };

  const RiskCard = ({ risk, onSave }: { risk: ChatRisk, onSave: (risk: ChatRisk) => void }) => {
    const formik = useFormik({
      initialValues: risk,
      onSubmit: values => {
        onSave(values);
      },
    });

    return (
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
      }}>
        <form onSubmit={formik.handleSubmit} style={{ padding: '20px', marginBottom: '20px' }}>
          <div>
            <Typography bold={true} size="big">Risk Name</Typography>
            <Input name="name" onChange={formik.handleChange} value={formik.values.name} />
          </div>
          <div>
            <Typography bold={true} size="big">Description</Typography>
            <Input 
              name="description" 
              onChange={formik.handleChange} 
              value={formik.values.description} 
              style={{ minHeight: '60px' }} // Adjust as needed for 2 lines
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
              <Typography bold={true} size="big">Impact (1-10)</Typography>
              <Input 
                type="number" 
                name="impact" 
                onChange={formik.handleChange} 
                value={formik.values.impact} 
                style={{ width: '100%' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography bold={true} size="big">Probability (1-10)</Typography>
              <Input 
                type="number" 
                name="probability" 
                onChange={formik.handleChange} 
                value={formik.values.probability} 
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Typography bold={true} size="big">Mitigations</Typography>
            {JSON.stringify(formik.values.mitigations)}
            {/* <Input 
              type="text" 
              name="probability" 
              onChange={formik.handleChange} 
              value={JSON.stringify(formik.values.mitigations)} 
              style={{ width: '100%' }}
            /> */}
          </div>`
          {/* Render mitigation strategies as sub-form if needed */}
          <Button type="primary">Save</Button>
        </form>
      </div>
    );
  };
  

  // Scroll to the bottom of the chat on update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formik = useFormik<ChatFormValues>({
    enableReinitialize: true,
    initialValues: {
      message: '',
    },
    // validationSchema: Yup.object({
    //   message: Yup.string().required('A message is required'),
    // }),
    onSubmit: async (values, { resetForm }) => {
      setSendMessageLoading(true)
      try {
        // sendMessage(values.message);
        const response = await AIAPI.sendChatMessage({
          query: values.message,
          isInitialMessage,
          chatContext: messages.map(msg => { 
            return {content: msg.content, role: msg.role}
          })
        })
        setInput('');
        setMessages(response.chatContext);
        resetForm(); // Reset the form after successful submission
      } catch (e: any) {
        Toast.error(e.message || "Something went wrong.")
      } finally {
        setSendMessageLoading(false)
        setIsInitialMessage(false);
      }
    }
  });

  return (
    <ScollablePage className={styles.page}>
      <Space size={52} />
      <Container>
        <Container>
          <Container className={styles.chatContainer}>
            {messages.map((msg, index) => {
              if (msg.role === 'system') return null;
              return (
                <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                  <Typography
                    style={{ fontSize: '16px', whiteSpace: 'pre-wrap'}}
                    // dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />')}}
                  >
                    {parseAndReplaceRisks(msg.content)}
                  </Typography>
                </div>
              )})}
            <div ref={bottomRef} />
          </Container>
          <form onSubmit={formik.handleSubmit}>
            <input
              id="message"
              name="message"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              className={styles.chatInput}
              placeholder="Type your message here..."
              onKeyPress={event => {
                if (event.key === 'Enter' && !formik.isSubmitting) {
                  formik.handleSubmit();
                }
              }}
            />
            {formik.touched.message && formik.errors.message ? (
              <div className="error">{formik.errors.message}</div>
            ) : null}
            <Button 
              type="primary"
              loading={isSendMessageLoading} onClick={() => {
                formik.handleSubmit()
              }}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Container>
        <FlexBox flexDirection="column"justifyContent="space-between" alignItems="center">
          
          <Space size={30} horizontal />
          
        </FlexBox>
        <Space size={24} />
      </Container>
      <Space size={52} />
    </ScollablePage>
  );
};

export default Page;
