import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  onConfirm: Function;
}

const ConfirmDelete = (props: Props) => {
  return (
    <Popconfirm
      title="Kustutada?"
      cancelText="Tühista"
      okText="Jah!"
      onConfirm={() => props.onConfirm()}
    >
      <DeleteOutlined
        onClick={(e) => e.stopPropagation()}
        style={{ color: "red" }}
      />
    </Popconfirm>
  );
};

export default ConfirmDelete;
