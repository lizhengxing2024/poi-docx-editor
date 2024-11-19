import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar } from "@wangeditor/editor";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

import "./style/RichTextEditor.scss";

export interface RichTextEditorProps {
  html: string;
  onChange: (html: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  showToolbar: boolean;
  toolbarContainer: () => HTMLDivElement;
}

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const {
    html,
    onChange,
    onFocus,
    onBlur,
    showToolbar = true,
    toolbarContainer,
  } = props;

  const editorDefaultConfig = {};
  const editorDOMRef = useRef<HTMLDivElement>(null);
  const editorInstRef = useRef<IDomEditor | null>(null);
  const editorHtmlRef = useRef<string>();
  const [editorInstReady, setEditorInstReady] = useState(false);

  const toolbarDefaultConfig = {};
  const toolbarDOMRef = useRef<HTMLDivElement>(null);

  const handleCreated = (editor: IDomEditor) => {
    editorHtmlRef.current = html;
    editor.setHtml(html); // 设置外部初值
    editorInstRef.current = editor;
    setEditorInstReady(true);
  };

  const handleChanged = (editor: IDomEditor) => {
    onChange(editor.getHtml());
  };

  useEffect(() => {
    if (editorInstRef.current == null) return;

    if (html === editorHtmlRef.current) return;

    editorInstRef.current.setHtml(html);
  }, [html]);

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
        onFocus: onFocus,
        onBlur: onBlur,
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

  return (
    <div className="questioneditor—wrapper">
      {createPortal(
        <div
          className="toolbar-container"
          ref={toolbarDOMRef}
          style={!showToolbar ? { display: "none" } : {}}
        ></div>,
        toolbarContainer()
      )}
      <div className="editor-container" ref={editorDOMRef}></div>
    </div>
  );
};

export default RichTextEditor;
