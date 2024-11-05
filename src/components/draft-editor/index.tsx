import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  DraftComponent,
  DraftModel,
  convertFromRaw,
} from "draft-js";
import classnames from 'classnames'
import lodash from 'lodash'

import styles from "./style.module.scss";
import Misc from '@/utils/misc'
import Toolbar from "./toolbar";

interface IProps {
  onChange?: (value: string) => void
  defaultValue?: string
  value?: string
  viewOnly?: boolean
  wrapperClass?: string;
  border?:boolean;
}

const styleMap: DraftComponent.Base.DraftStyleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  HIGHLIGHT: {
    backgroundColor: "#F7A5F7",
  },
  UPPERCASE: {
    textTransform: "uppercase",
  },
  LOWERCASE: {
    textTransform: "lowercase",
  },
  CODEBLOCK: {
    fontFamily: '"fira-code", "monospace"',
    fontSize: "inherit",
    background: "#ffeff0",
    fontStyle: "italic",
    lineHeight: 1.5,
    padding: "0.3rem 0.5rem",
    borderRadius: " 0.2rem",
  },
  SUPERSCRIPT: {
    verticalAlign: "super",
    fontSize: "80%",
  },
  SUBSCRIPT: {
    verticalAlign: "sub",
    fontSize: "80%",
  },
};

const DraftEditor = ({ onChange: onChangeProps, defaultValue, value: valueProps, viewOnly, wrapperClass,border }: IProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const editorRef = useRef<any>(null)
  const preventValuePopulateRef = useRef<boolean>(false)

  const focusEditor = () => {
    editorRef.current.focus();
  };

  const setValue = (value?: string) => {
    if (value && Misc.isJson(value)) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(value))))
    }
  }

  useEffect(() => {
    setValue(defaultValue)

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (preventValuePopulateRef.current) return

    setValue(valueProps)
    // eslint-disable-next-line
  }, [valueProps]);

  const revertPreventValuePopulateDebounce = useRef(lodash.debounce(() => {
    preventValuePopulateRef.current = false
  }, 500))

  const onChange = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    onChangeProps?.(JSON.stringify(convertToRaw(contentState)))
    setEditorState(editorState);

    preventValuePopulateRef.current = true
    revertPreventValuePopulateDebounce.current()
  }

  const blockStyleFn = (contentBlock: DraftModel.ImmutableData.ContentBlock): string => {
    const type = contentBlock.getType();
    switch (type) {
    case "blockQuote":
      return "superFancyBlockquote";
    case "leftAlign":
      return "leftAlign";
    case "rightAlign":
      return "rightAlign";
    case "centerAlign":
      return "centerAlign";
    case "justifyAlign":
      return "justifyAlign";
    default:
      return ""
    }
  };

  return (
    <div className={classnames(styles.editorWrapper, wrapperClass, {
      [`${styles.editorWrapperViewOnly}`]: !border && viewOnly, [styles.disabledBackground]: border && viewOnly
    })} onClick={focusEditor}>
      {!viewOnly && (
        <Toolbar editorState={editorState} setEditorState={setEditorState} />
      )}
      <div className={classnames(styles.editorContainer, { [styles.editorContainerViewOnly]: !border && 
        viewOnly,[styles.disabledBackground]: border && viewOnly })}>
        <Editor
          readOnly={viewOnly}
          ref={editorRef}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFn}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default DraftEditor;