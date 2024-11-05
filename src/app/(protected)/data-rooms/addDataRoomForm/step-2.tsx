
import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "antd";

import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import styles from "./page.module.scss";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Typography from "@/components/typography";
import Clickable from "@/components/clickable";
import Loading from "@/components/loading";
import Image from "next/image"

type TProps = {
  setStep: (state: number) => void;
  structure: any;
  loading?: boolean;
  handleChange: (key: string, value: any) => void;
  data?: any;
  vdrLoading?: boolean;
  handleSubmit?: any
};

type RenderProps = {
  items: any;
  selectItem?: boolean;
  parentItem?: any;
  updateStructure?: any;
};

type IFolder = {
  item: any;
  selectItem?: boolean;
  parentItem?: boolean;
  updateStructure?: any;
};

const Folder = ({ item, updateStructure }: IFolder) => {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const checkBoxRef = useRef<any>(null);

  useEffect(() => {
    setSelect(item?.is_visible ? item?.is_visible : false);
    if (checkBoxRef?.current) {
      checkBoxRef.current.checked = item?.is_visible ? item?.is_visible : false;
    }
  }, [item]);

  return (
    <>
      {" "}
      <FlexBox alignItems="center" className={styles.folder}>
        <Checkbox
          className={styles.checkBox}
          checked={select}
          ref={checkBoxRef}
          onChange={(e) => {
            setSelect(e.target.checked);
            updateStructure({ ...item, is_visible: e.target.checked });
          }}
        />
        <Space horizontal size={15} />
        <Image
          src={`/icons/gray-${
            item.type === "FOLDER" ? "folder" : "document"
          }-icon.svg`}
          alt="icon"
          width={24}
          height={24}
        />
        <Space horizontal size={15} />
        <Typography darkBlue>{item?.name}</Typography>
        <Space horizontal size={8} />
        {item?.children?.length ? (
          <Clickable
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <Space size={12} />
            {open ? (
              <Icon name="arrowUp" alt="icon" size={16} color="#a0a4b6" />
            ) : (
              <Icon name="arrowDown" alt="icon" size={16} color="#a0a4b6" />
            )}
          </Clickable>
        ) : <></>}
        <div className={styles.border}></div>
      </FlexBox>
      <div className={styles.subBlocks}>
        {open && (
          <RenderItems
            parentItem={item?.name}
            items={item?.children}
            updateStructure={updateStructure}
          />
        )}
      </div>
    </>
  );
};

function RenderItems({ items, selectItem, updateStructure }: RenderProps) {
  return items?.map((item: any, index: number) => {
    return (
      <Folder
        selectItem={selectItem}
        item={item}
        updateStructure={updateStructure}
        key={index}
      />
    );
  });
}

const AddDataRoomStep2 = ({
  setStep,
  structure,
  loading,
  handleChange,
  data,
  vdrLoading,
  handleSubmit
}: TProps) => {
  const updateValue = (item: any, object: any) => {
    if (object?.id === item?.id && object?.name === item?.name) {
      object.is_visible = item?.is_visible;
      return true;
    }
    if (Array.isArray(object?.children)) {
      for (const child of object?.children) {
        if (updateValue(item, child)) {
          return true;
        }
      }
    }
    return false;
  };

  const updateStructure = (item: any) => {
    for (const key in data) {
      updateValue(item, data[key]);
    }
    handleChange("structure", data);
  };

  return (
    <div className={styles.folderList}>
      <Space size={24} />
      <FlexBox alignItems="center" gap={10}>
        <span className={styles.barActive}></span>
        <span className={styles.barActive}></span>
        <span className={styles.bar}></span>
      </FlexBox>

      <Space size={24} />
      {loading ? (
        <Loading size="small" />
      ) : (
        <>
          <FlexBox
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Space size={24} />
            <Typography size="huge" darkBlue={true}>Folder Structure</Typography>
            <Space size={24} />

            <RenderItems items={structure} updateStructure={updateStructure} />
          </FlexBox>
          <Space size={24} />
          <FlexBox gap={5} justifyContent="flex-end">
            <Button
              disabled={vdrLoading}
              className={`${styles.formButton} ${styles.backButton}`}
              onClick={() => {
                setStep(1);
              }}
            >
              Back
            </Button>
            <Button
              loading={vdrLoading}
              className={styles.formButton}
              onClick={() => {
                handleSubmit();
              }}
            >
              Create Data Room
            </Button>
          </FlexBox>
        </>
      )}
    </div>
  );
};

export default AddDataRoomStep2;
