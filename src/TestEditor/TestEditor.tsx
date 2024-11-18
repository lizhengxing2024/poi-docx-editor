import React, { useState, useEffect, useRef } from "react";

import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar } from "@wangeditor/editor";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

import "./style/TestEditor.scss";

const TestEditor: React.FC = () => {
  const editorDOMRef = useRef<HTMLDivElement>(null);
  const toolbarDOMRef = useRef<HTMLDivElement>(null);

  const [editorInstReady, setEditorInstReady] = useState(false);
  const editorInstRef = useRef<IDomEditor | null>(null);

  const editorDefaultConfig = {};
  const toolbarDefaultConfig = {};
  const defaultHtml = "";

  const [editorValue, setEditorValue] = useState<string>("");

  //   const [curValue, setCurValue] = useState("");

  //   const toolbarConfig: Partial<IToolbarConfig> = {};

  //   const editorConfig: Partial<IEditorConfig> = {
  //     placeholder: "请输入内容...",
  //   };

  const handleCreated = (editor: IDomEditor) => {
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
      html: editorValue,
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
    <div className="testeditor—wrapper">
      <div className="toolbar-container" ref={toolbarDOMRef}></div>
      <div className="editor-container" ref={editorDOMRef}></div>
    </div>
  );
};

export default TestEditor;
