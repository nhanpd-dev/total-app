import React, { useEffect, useState } from "react";
import { Layout, Space, Input, Button } from "antd";
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
  flex: 1,
  alignItems: "center",
  flexDirection: "column",
  padding: 16,
};

const layoutStyle = {
  width: "100%",
  display: "flex",
  height: "100vh",
  flex: 1,
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
  const [total, setTotal] = useState<number>(0);
  const [value, setValue] = useState<string | number>(0);

  const onChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target } = e;
    const { value } = target;
    const convertNumber = (value || "").replace(/\D/g, "");
    setValue(convertNumber);
  };

  const onAdd = () =>
    updateItem(`/data`, {
      total: increment(+value),
    }).then(() => setValue(""));

  const onReset = () =>
    updateItem(`/data`, {
      total: 0,
    }).then(() => setValue(""));

  useEffect(() => {
    const queryTotal = query(ref(database, `data/total`));
    onValue(
      queryTotal,
      (snapshots) => {
        // on success
        if (snapshots.exists()) {
          setTotal(snapshots.val());
        } else {
          setTotal(0);
        }
      },
      (err) => {
        console.log("=====> ERROR: ", err);
      } // on error
    );
  }, []);
  
  return (
    <div style={{ ...layoutStyle, flexDirection: "column" }}>
      <Header style={headerStyle}>
        <h1>Total APP</h1>
      </Header>
      <Content style={contentStyle}>
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
              onChange={onChangeText}
              defaultValue=""
              onPressEnter={onAdd}
              value={value || ""}
            />
            <Button onClick={onAdd} type="primary">
              Lưu
            </Button>
          </Space.Compact>
          <Button
            onClick={onReset}
            style={{ marginLeft: 16 }}
            danger
            type="primary"
          >
            Reset
          </Button>
        </div>

        <h1>
          Total: <span style={{ color: "green" }}>{total}</span>
        </h1>
      </Content>
    </div>
  );
};

export default App;
