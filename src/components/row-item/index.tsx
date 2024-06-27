import React, { useEffect, useState } from "react";
import { Space, Input, Button } from "antd";
import {
  ref,
  increment,
  onValue,
  query,
  off,
  updateItem,
  database
} from '../../firebase';

interface IProps {
  currentKey: string | null;
}
interface Item {
  name: string;
  field: "b" | "t" | "g" | "th";
}
const dataList: Item[] = [
  {
    name: "B",
    field: "b",
  },
  {
    name: "T",
    field: "t",
  },
  {
    name: "G",
    field: "g",
  },
  {
    name: "Th",
    field: "th",
  },
];
interface Data {
  key: string;
  g: {
    t: number;
    x: number;
  };
  t: {
    t: number;
    x: number;
  };
  b: {
    t: number;
    x: number;
  };
  th: {
    t: number;
    x: number;
  };
  createdAt: number;
}

interface IItem {
  item: Item;
  currentData: Data | null;
  currentKey: string | null;
}
const ItemFC: React.FC<IItem> = ({ item, currentData, currentKey }) => {
  const [valueA, setValueA] = useState<string | number>(0);
  const [valueB, setValueB] = useState<string | number>(0);

  const onAddA = ({
    name,
    field,
    value,
  }: {
    name: "T" | "X";
    field: "b" | "t" | "g" | "th";
    value: number;
  }) => {

    if (name === "T" && currentData) {
      updateItem(`/matchs/${currentKey}`, {
        ...currentData,
        [`${field}`]: {
          ...currentData[`${field}`],
          t: increment(value),
        },
      }).then(() => setValueA(""));
    }

    if (name === "X" && currentData) {
      updateItem(`/matchs/${currentKey}`, {
        ...currentData,
        [`${field}`]: {
          ...currentData[`${field}`],
          x: increment(value),
        },
      }).then(() => setValueB(""));
    }
  };

  const onResetA = ({
    name,
    field,
  }: {
    name: "T" | "X";
    field: "b" | "t" | "g" | "th";
  }) => {
    if (name === "T" && currentData) {
      updateItem(`/matchs/${currentKey}`, {
        ...currentData,
        [`${field}`]: {
          ...currentData[`${field}`],
          t: 0,
        },
      }).then(() => setValueA(""));
    }
    if (name === "X" && currentData) {
      updateItem(`/matchs/${currentKey}`, {
        ...currentData,
        [`${field}`]: {
          ...currentData[`${field}`],
          x: 0,
        },
      }).then(() => setValueB(""));
    }
  };

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

  return (
    <div
      key={item.field}
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 16,
      }}
    >
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
              onPressEnter={() =>
                onAddA({ name: "T", field: item.field, value: +valueA })
              }
              value={valueA || ""}
            />
            <Button
              disabled={!valueA}
              onClick={() =>
                onAddA({ name: "T", field: item.field, value: +valueA })
              }
              type="primary"
            >
              Lưu T {item.name}
            </Button>
          </Space.Compact>
          <Button
            onClick={() => onResetA({ name: "T", field: item.field })}
            style={{ marginLeft: 16 }}
            danger
            type="primary"
            disabled={!valueA}
          >
            Reset T {item.name}
          </Button>
        </div>
        <h1 style={{ fontWeight: 500 }}>
          Total T {item.name}:{" "}
          <span style={{ color: "green" }}>
            {currentData && currentData[`${item.field}`].t}
          </span>
        </h1>
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
              onPressEnter={() =>
                onAddA({ name: "X", field: item.field, value: +valueB })
              }
              value={valueB || ""}
            />
            <Button
              disabled={!valueB}
              onClick={() =>
                onAddA({ name: "X", field: item.field, value: +valueB })
              }
              type="primary"
            >
              Lưu X {item.name}
            </Button>
          </Space.Compact>
          <Button
            disabled={!valueB}
            onClick={() => onResetA({ name: "X", field: item.field })}
            style={{ marginLeft: 16 }}
            danger
            type="primary"
          >
            Reset X {item.name}
          </Button>
        </div>
        <h1 style={{ fontWeight: 500 }}>
          Total X {item.name}:{" "}
          <span style={{ color: "green" }}>
            {currentData && currentData[`${item.field}`].x}
          </span>
        </h1>
      </div>
    </div>
  );
};
const RowItem: React.FC<IProps> = ({ currentKey }) => {
  const [currentData, setCurrentData] = useState<Data | null>(null);

  useEffect(() => { 
    if(currentKey) {
      const queryTotalA = query(ref(database, `matchs/${currentKey}`));
      onValue(
        queryTotalA,
        (snapshots) => {
          // on success
          if (snapshots.exists()) {
            setCurrentData(snapshots.val());
          } else {
            setCurrentData(null);
          }
          // setLoading(false);
        },
        (err) => {
          console.log("=====> ERROR: ", err);
        } // on error
      );
  
    }
    return () => {
      const queryTotalA = query(ref(database, `matchs/${currentKey}`));

      console.log('====> s');
      off(queryTotalA, 'value');
    }
  }, [currentKey]);

  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
      {dataList.map((item) => (
        <ItemFC
          key={item.field}
          currentData={currentData}
          currentKey={currentKey}
          item={item}
        />
      ))}
    </div>
  );
};

export default RowItem;
