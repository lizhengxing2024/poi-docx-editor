import React, { useState } from "react";

import RichTextEditor from "./components/RichTextEditor/RichTextEditor";

import "./style/QuestionEditor.scss";

export enum QuestionItemEditorType {
  SIMPLE_TEXT_EDITOR = "simple-text-editor",
  SIMPLE_DROPDOWN_EDITOR = "simple-dropdown-editor",
  RICH_TEXT_EDITOR = "rich-text-editor",
}

export interface QuestionI {
  id: string;
  label: string;
  value: string;
  editor: QuestionItemEditorType;
  dropdownCode?: { value: string; content: string }[];
}

interface QuestionEditorProps {
  question: Array<QuestionI>;
  onChange: (questionItem: QuestionI, value: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = (props) => {
  const { question, onChange } = props;

  const [toolbarWrapperDOM, setToolbarWrapperDOM] =
    useState<HTMLDivElement | null>();

  return (
    <div className="questioneditor">
      <div className="toolbar-wrapper" ref={setToolbarWrapperDOM}></div>
      <div className="content-wrapper">
        {toolbarWrapperDOM &&
          question.map((q) => {
            if (q.editor === QuestionItemEditorType.SIMPLE_TEXT_EDITOR) {
              return (
                <div className="questionitem" key={q.id}>
                  <div className="questionitem__label">{q.label}</div>
                  <div className="questionitem__value">
                    <input
                      value={q.value}
                      onChange={(e) => {
                        onChange(q, e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
              );
            } else if (
              q.editor === QuestionItemEditorType.SIMPLE_DROPDOWN_EDITOR
            ) {
              return (
                <div className="questionitem" key={q.id}>
                  <div className="questionitem__label">{q.label}</div>
                  <div className="questionitem__value">
                    <select
                      value={q.value}
                      onChange={(e) => {
                        onChange(q, e.target.value);
                      }}
                    >
                      {q.dropdownCode?.map(({ value, content }) => (
                        <option key={value} value={value}>
                          {content}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            } else if (q.editor === QuestionItemEditorType.RICH_TEXT_EDITOR) {
              return (
                <div className="questionitem" key={q.id}>
                  <div className="questionitem__label">{q.label}</div>
                  <div className="questionitem__value">
                    <RichTextEditor
                      html={q.value}
                      onChange={(html) => {
                        onChange(q, html);
                      }}
                      toolbarContainer={() => toolbarWrapperDOM!}
                    ></RichTextEditor>
                  </div>
                </div>
              );
            } else {
              return <div key={q.id}>还没处理好...{q.editor}</div>;
            }
          })}
      </div>
    </div>
  );
};

export default QuestionEditor;
