import React, { useState, useEffect, useRef } from "react";

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
    useState<HTMLDivElement | null>(); // 子元素（富文本编辑器）需要等父元素挂载好才能渲染（因为toolbar需要挂载上来）

  /**
   * 视觉上，多个 富文本编辑器 共用一个 toolbar
   * 实际上，多个 富文本编辑器 的 toolbar 都渲染在同一个区域，
   *    通过保证无论何时，只有一个 toolbar 显示实现该效果
   *    1. 初始化时，第一个富文本编辑器的 toolbar 可见
   *    2. 最后一次获取 focus 的富文本编辑器的 toolbar 可见
   */
  const [
    currentVisibleRichTextEditorToolbar,
    setCurrentVisibleRichTextEditorToolbar,
  ] = useState<string>(
    question.filter(
      (x) => x.editor === QuestionItemEditorType.RICH_TEXT_EDITOR
    )[0].id
  );

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
                      onFocus={() =>
                        setCurrentVisibleRichTextEditorToolbar(q.id)
                      }
                      onBlur={() => {}}
                      showToolbar={currentVisibleRichTextEditorToolbar === q.id}
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
