import React, { useState, useEffect, useRef } from "react";

import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar } from "@wangeditor/editor";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

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

  const editorDefaultConfig = {};
  const editorDOMRef = useRef<HTMLDivElement>(null);
  const editorInstRef = useRef<IDomEditor | null>(null);
  const [editorInstReady, setEditorInstReady] = useState(false);
  const [editorValue, setEditorValue] = useState<string>("");

  const toolbarDefaultConfig = {};
  const toolbarDOMRef = useRef<HTMLDivElement>(null);

  //   const [curValue, setCurValue] = useState("");

  //   const toolbarConfig: Partial<IToolbarConfig> = {};

  //   const editorConfig: Partial<IEditorConfig> = {
  //     placeholder: "请输入内容...",
  //   };

  const handleCreated = (editor: IDomEditor) => {
    editor.setHtml(""); // 设置外部初值
    editorInstRef.current = editor;
    setEditorInstReady(true);
  };

  const handleChanged = (editor: IDomEditor) => {
    setEditorValue(editor.getHtml());
  };

  /**
   * 因为 React.StrictMode 模式下，组件生命周期连续渲染两次，
   * 但是 wangEditor 的 createEditor 方法返回后，并不代表组件已创建完成，立即执行 destroy 方法会导致异常。
   *
   * 所以只能通过避免在同一个 DOM 结构上创建两次 wangEditor 来绕过此问题
   * 即：getAttribute("data-w-e-textarea")
   */
  useEffect(() => {
    if (toolbarDOMRef.current == null) return;
    if (editorDOMRef.current == null) return;

    // 防止重复渲染 当编辑器已经创建就不在创建了
    if (editorDOMRef.current?.getAttribute("data-w-e-textarea")) return;

    const newEditor = createEditor({
      selector: editorDOMRef.current,
      config: {
        ...editorDefaultConfig,
        onCreated: handleCreated,
        onChange: handleChanged,
      },
      html: "",
      mode: "default",
    });

    createToolbar({
      editor: newEditor,
      selector: toolbarDOMRef.current,
      config: toolbarDefaultConfig,
      mode: "default",
    });

    return () => {
      if (editorInstRef.current == null) return;
      editorInstRef.current.destroy();
      editorInstRef.current = null;
    };
  }, []);

  //   useEffect(() => {
  //     if (editor == null) return;

  //     // if (value === curValue) return // 如果和当前 html 值相等，则忽略

  //     // ------ 重新设置 HTML ------
  //     try {
  //       editor.setHtml(value);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, [value]);

  return (
    <div className="questioneditor">
      {question.map((q) => {
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
        } else if (q.editor === QuestionItemEditorType.SIMPLE_DROPDOWN_EDITOR) {
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
        } else {
          return <div key={q.id}>还没处理好...{q.editor}</div>;
        }
      })}

      <div className="questioneditor—wrapper">
        <div className="toolbar-container" ref={toolbarDOMRef}></div>
        <div className="editor-container" ref={editorDOMRef}></div>
      </div>
    </div>
  );
};

export default QuestionEditor;
