import React from "react";
import { RichUtils } from "draft-js";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  HighlightOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  UpOutlined,
  DownOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined
} from '@ant-design/icons';
import classnames from 'classnames'

import Icon from '@/components/icon'
import styles from "./style.module.scss";

const icon = { fontSize: 18 }

const tools = [
  {
    label: "bold",
    style: "BOLD",
    icon: <BoldOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "italic",
    style: "ITALIC",
    icon: <ItalicOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "underline",
    style: "UNDERLINE",
    icon: <UnderlineOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "highlight",
    style: "HIGHLIGHT",
    icon: <HighlightOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "strike-through",
    style: "STRIKETHROUGH",
    icon: <StrikethroughOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "Monospace",
    style: "CODE",
    icon: <CodeOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "Blockquote",
    style: "blockQuote",
    icon: <Icon name="quotes" size={18} />,
    method: "block",
  },
  {
    label: "Unordered-List",
    style: "unordered-list-item",
    method: "block",
    icon: <UnorderedListOutlined style={icon} />,
  },
  {
    label: "Ordered-List",
    style: "ordered-list-item",
    method: "block",
    icon: <OrderedListOutlined style={icon} />,
  },
  {
    label: "Code Block",
    style: "CODEBLOCK",
    icon: <Icon name="code" size={18} />,
    method: "inline",
  },
  {
    label: "Uppercase",
    style: "UPPERCASE",
    icon: <UpOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "lowercase",
    style: "LOWERCASE",
    icon: <DownOutlined style={icon} />,
    method: "inline",
  },
  {
    label: "Left",
    style: "leftAlign",
    icon: <AlignLeftOutlined style={icon} />,
    method: "block",
  },
  {
    label: "Center",
    style: "centerAlign",
    icon: <AlignCenterOutlined style={icon} />,
    method: "block",
  },
  {
    label: "Right",
    style: "rightAlign",
    icon: <AlignRightOutlined style={icon} />,
    method: "block",
  },
];

const Toolbar = ({ editorState, setEditorState }: any) => {
  const applyStyle = (e: any, style: any, method: any) => {
    e.preventDefault();
    method === "block"
      ? setEditorState(RichUtils.toggleBlockType(editorState, style))
      : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isActive = (style: any, method: any) => {
    if (method === "block") {
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      return blockType === style;
    } else {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    }
  };

  return (
    <div className={styles.toolbar}>
      {tools.map((item, idx) => (
        <button
          className={classnames(styles.item, { [styles.active]: isActive(item.style, item.method) })}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
