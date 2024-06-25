import React, { useEffect, useState } from "react";
import { Layout, Space, Input, Button, Spin } from "antd";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  update,
  increment,
  onValue,
  query,
} from "firebase/database";

const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  color: "#fff",
  height: 64,
  backgroundColor: "#4096ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const contentStyle: React.CSSProperties = {
  display: "flex",
  padding: 16,
  gap: 32,
};

const layoutStyle = {
  width: "100%",
  display: "flex",
};

const firebaseConfig = {
  apiKey: "AIzaSyBkEVokPydqVt1BhWdySkIAoQ4u6X6m140",
  authDomain: "chat-app-a0220.firebaseapp.com",
  databaseURL: "https://chat-app-a0220-default-rtdb.firebaseio.com",
  projectId: "chat-app-a0220",
  storageBucket: "chat-app-a0220.appspot.com",
  messagingSenderId: "1096381292862",
  appId: "1:1096381292862:web:022ba878f061d05a208c6f",
  measurementId: "G-2H7MM5XGV0",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const updateItem = (path: any, body: any) =>
  update(ref(database, path), body);

const App: React.FC = () => {
  const [totalA, setTotalA] = useState<number>(0);
  const [valueA, setValueA] = useState<string | number>(0);
  const [totalB, setTotalB] = useState<number>(0);
  const [valueB, setValueB] = useState<string | number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const onChangeTextA = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target } = e;
    const { value } = target;
    const convertNumber = (value || "").replace(/\D/g, "");
    setValueA(convertNumber);
  };

  const onChangeTextB = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target } = e;
    const { value } = target;
    const convertNumber = (value || "").replace(/\D/g, "");
    setValueB(convertNumber);
  };

  const onAddA = () => {
    setLoading(true);
    updateItem(`/data`, {
      totalA: increment(+valueA),
    }).then(() => setValueA(""));
  };

  const onResetA = () => {
    setLoading(true);
    updateItem(`/data`, {
      totalA: 0,
    }).then(() => setValueA(""));
  };

  const onAddB = () => {
    setLoading(true);
    updateItem(`/data`, {
      totalB: increment(+valueB),
    }).then(() => setValueB(""));
  };

  const onResetB = () => {
    setLoading(true);
    updateItem(`/data`, {
      totalB: 0,
    }).then(() => setValueB(""));
  };

  useEffect(() => {
    const queryTotalA = query(ref(database, `data/totalA`));
    onValue(
      queryTotalA,
      (snapshots) => {
        // on success
        if (snapshots.exists()) {
          setTotalA(snapshots.val());
        } else {
          setTotalA(0);
        }
        setLoading(false);
      },
      (err) => {
        console.log("=====> ERROR: ", err);
      } // on error
    );
    const queryTotalB = query(ref(database, `data/totalB`));
    onValue(
      queryTotalB,
      (snapshots) => {
        // on success
        if (snapshots.exists()) {
          setTotalB(snapshots.val());
        } else {
          setTotalB(0);
        }
        setLoading(false);
      },
      (err) => {
        console.log("=====> ERROR: ", err);
      } // on error
    );
  }, []);

  return (
    <div style={{ ...layoutStyle, flexDirection: "column", }}>
      <Header style={headerStyle}>
        <h1>Total APP</h1>
      </Header>
      <Content style={contentStyle}>
        <div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Space.Compact style={{ width: "80%" }}>
              <Input
                onChange={onChangeTextA}
                defaultValue=""
                onPressEnter={onAddA}
                value={valueA || ""}
              />
              <Button onClick={onAddA} type="primary">
                Lưu A
              </Button>
            </Space.Compact>
            <Button
              onClick={onResetA}
              style={{ marginLeft: 16 }}
              danger
              type="primary"
            >
              Reset A
            </Button>
          </div>
          <Spin spinning={loading}>
            <h1 style={{ fontWeight: 500 }}>
              Total A: <span style={{ color: "green" }}>{totalA}</span>
            </h1>
          </Spin>
        </div>
        <div
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Space.Compact style={{ width: "80%" }}>
              <Input
                onChange={onChangeTextB}
                defaultValue=""
                onPressEnter={onAddB}
                value={valueB || ""}
              />
              <Button onClick={onAddB} type="primary">
                Lưu B
              </Button>
            </Space.Compact>
            <Button
              onClick={onResetB}
              style={{ marginLeft: 16 }}
              danger
              type="primary"
            >
              Reset B
            </Button>
          </div>
          <Spin spinning={loading}>
            <h1 style={{ fontWeight: 500 }}>
              Total B: <span style={{ color: "green" }}>{totalB}</span>
            </h1>
          </Spin>
        </div>
      </Content>
      <div style={{ width: "100%", height: 1, background: "#000000" }} />
      <div>
        <Spin spinning={loading}>
          <h1 style={{ color: "", fontWeight: "bold", textAlign: 'center' }}>
            {`Total A - Total B: `}{" "}
            <span style={{ color: "green" }}>{totalA - totalB}</span>
          </h1>
        </Spin>
      </div>
    </div>
  );
};

export default App;
