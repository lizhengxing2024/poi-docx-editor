import { useState } from "react";
import QuestionEditor, {
  QuestionItemEditorType,
  QuestionI,
} from "./QuestionEditor/QuestionEditor";

import "./app.scss";

function App() {
  const [question, setQuestion] = useState([
    {
      id: "001",
      label: "题型",
      value: "多项选择题",
      editor: QuestionItemEditorType.SIMPLE_TEXT_EDITOR,
    },
    {
      id: "002",
      label: "预估难度",
      value: "中",
      editor: QuestionItemEditorType.SIMPLE_DROPDOWN_EDITOR,
      dropdownCode: [
        { value: "", content: "选择一项。" },
        {
          value: "难",
          content: "难",
        },
        {
          value: "中难",
          content: "中难",
        },
        {
          value: "中",
          content: "中",
        },
        {
          value: "中易",
          content: "中易",
        },
        {
          value: "易",
          content: "易",
        },
      ],
    },
    {
      id: "003",
      label: "语料出处",
      value: "",
      editor: QuestionItemEditorType.RICH_TEXT_EDITOR,
    },
    {
      id: "004",
      label: "试题描述",
      value: "",
      editor: QuestionItemEditorType.RICH_TEXT_EDITOR,
    },
  ]);

  const handleChange = (questionItem: QuestionI, value: string) => {
    setQuestion((question) =>
      question.map((q) =>
        q.id === questionItem.id
          ? {
              ...q,
              value,
            }
          : q
      )
    );
  };

  return (
    <QuestionEditor
      question={question}
      onChange={handleChange}
    ></QuestionEditor>
  );
}

export default App;
