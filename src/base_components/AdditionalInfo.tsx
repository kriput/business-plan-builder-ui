import { QuestionCircleOutlined } from "@ant-design/icons";
import React, {JSX} from "react";
import useModal from "antd/es/modal/useModal";

interface Props {
  info: string | JSX.Element
}

const AdditionalInfo = (props: Props) => {
  const [modal, contextHolder] = useModal();

  return (
    <>
      {contextHolder}
      <QuestionCircleOutlined
        className="info"
        onClick={() =>
          modal.info({
            title: "Lisainfo",
            content:
              props.info,
          })
        }
      />
    </>
  );
};

export default AdditionalInfo;
