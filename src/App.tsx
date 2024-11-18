import React, { useState, useEffect, useRef } from "react";

import "@wangeditor/editor/dist/css/style.scss";
import "./app.css";

import { createEditor, createToolbar } from "@wangeditor/editor";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

function App() {
  const editorDefaultConfig = {};
  const toolbarDefaultConfig = {};
  const defaultHtml = "";

  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState("<p>hello</p>");

  const [curValue, setCurValue] = useState("");

  const toolbarConfig: Partial<IToolbarConfig> = {};

  const editorDOMRef = useRef<HTMLDivElement>(null);
  const toolbarDOMRef = useRef<HTMLDivElement>(null);

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };

  const handleChanged = (editor: IDomEditor) => {
    setCurValue(editor.getHtml()); // 记录当前 html 值

    // 组件属性 onChange
    if (onChange) onChange(editor);

    // 编辑器 配置 onChange
    const { onChange: onChangeFromConfig } = defaultConfig;
    if (onChangeFromConfig) onChangeFromConfig(editor);
  };

  const handleCreated = (editor: IDomEditor) => {
    // 组件属性 onCreated
    if (onCreated) onCreated(editor);

    // 编辑器 配置 onCreated
    const { onCreated: onCreatedFromConfig } = defaultConfig;
    if (onCreatedFromConfig) onCreatedFromConfig(editor);
  };

  const handleDestroyed = (editor: IDomEditor) => {
    const { onDestroyed } = defaultConfig;
    setEditor(null);
    if (onDestroyed) {
      onDestroyed(editor);
    }
  };

  useEffect(() => {
    if (editorDOMRef.current == null) return;
    if (editor != null) return;
    // 防止重复渲染 当编辑器已经创建就不在创建了
    if (editorDOMRef.current?.getAttribute("data-w-e-textarea")) return;

    const newEditor = createEditor({
      selector: editorDOMRef.current,
      config: {
        ...editorDefaultConfig,
        onCreated: handleCreated,
        onChange: handleChanged,
        onDestroyed: handleDestroyed,
      },
      content: defaultContent,
      html: defaultHtml || value,
      mode: "default",
    });
    setEditor(newEditor);

    if (toolbarDOMRef.current == null) return;
    if (editor == null) return;

    createToolbar({
      editor,
      selector: toolbarDOMRef.current,
      config: toolbarDefaultConfig,
      mode: "default",
    });

    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    if (editor == null) return;

    // if (value === curValue) return // 如果和当前 html 值相等，则忽略

    // ------ 重新设置 HTML ------
    try {
      editor.setHtml(value);
    } catch (error) {
      console.error(error);
    }
  }, [value]);

  return (
    <div id="editor—wrapper">
      <div id="toolbar-container" ref={toolbarDOMRef}></div>
      <div id="editor-container" ref={editorDOMRef}></div>
    </div>
  );
}

export default App;
