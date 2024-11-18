import QuestionEditor, {
  QuestionItemEditorType,
} from "./QuestionEditor/QuestionEditor";

import "./app.scss";

function App() {
  const question = [
    {
      label: "题型",
      value: "多项选择题",
      editor: QuestionItemEditorType.SIMPLE_TEXT_EDITOR,
    },
    {
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
      label: "语料出处",
      value: "",
      editor: QuestionItemEditorType.RICH_TEXT_EDITOR,
    },
  ];

  return <QuestionEditor question={question}></QuestionEditor>;
}

export default App;
