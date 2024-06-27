/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Layout, Space, Input, Button, TableProps, Table, Modal } from "antd";
import {
  createItem,
  database,
  removeItem,
  serverTimestamp,
  onValue,
  query,
  ref,
} from "./firebase";
import RowItem from "./components/row-item";

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  color: "#fff",
  height: 64,
  backgroundColor: "#4096ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const layoutStyle = {
  width: "100%",
  display: "flex",
};
interface DataType {
  key: string;
  name: string;
}

const App: React.FC = () => {
  const [hang, setHang] = useState<string>("");
  const [listM, setListM] = useState([]);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const onChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target } = e;
    const { value } = target;
    setHang(value);
  };
  const onRemoveM = (keyM: string) => removeItem(`/matchs/${keyM}`);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "STT",
      key: "stt",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "75%",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    // {
    //   title: "TT",
    //   dataIndex: "name",
    //   key: "name",
    //   width: "75%",
    //   render: (text) => <span style={{ fontWeight: 'bold'}}>{text}</span>,
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setModalOpen(true);
              setCurrentKey(record.key);
            }}
          >
            Chinh sua
          </Button>
          <Button onClick={() => onRemoveM(record.key)} type="primary" danger>
            Xoa
          </Button>
        </Space>
      ),
    },
  ];

  const createM = () => {
    createItem(`/matchs`, {
      name: hang,
      createdAt: serverTimestamp(),
      t: {
        t: 0,
        x: 0,
      },
      b: {
        t: 0,
        x: 0,
      },
      g: {
        t: 0,
        x: 0,
      },
      th: {
        t: 0,
        x: 0,
      },
    }).then(() => setHang(""));
  };

  useEffect(() => {
    const queryM = query(ref(database, `/matchs`));
    onValue(
      queryM,
      (snapshots) => {
        // on success
        if (snapshots.exists()) {
          const m: any = [];
          snapshots.forEach((item) => {
            m.push({
              ...item.val(),
              key: item.key,
            });
          });
          setListM(m);
        } else {
          setListM([]);
        }
      },
      (err) => {
        console.log("=====> ERROR: ", err);
      } // on error
    );
  }, []);
  const [modalpen, setModalOpen] = useState(false);

  return (
    <div style={{ ...layoutStyle, flexDirection: "column", gap: 24 }}>
      <Header style={headerStyle}>
        <h1>Total APP</h1>
      </Header>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Space.Compact style={{ width: "80%" }}>
          <Input
            onChange={onChangeText}
            defaultValue="Tạo Hàng"
            onPressEnter={createM}
            value={hang || ""}
          />
          <Button onClick={createM} type="primary">
            Tao M
          </Button>
        </Space.Compact>
      </div>

      <Table columns={columns} dataSource={listM} rowKey={(r) => r.key} />
      <Modal
        title="Chi tiet M"
        centered
        open={modalpen}
        onOk={() => {
          setCurrentKey(null);
          setModalOpen(false);
        }}
        onCancel={() => {
          setCurrentKey(null);
          setModalOpen(false);
        }}
        width={1000}
      >
        <RowItem currentKey={currentKey} />
      </Modal>
    </div>
  );
};

export default App;
