import React from "react";
import { useEffect } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { useRef } from "react";
import ACTIONS from "../actions";
const Editor = ({ socketref, roomId, onCodechange }) => {
  const editorref = useRef(null);
  useEffect(() => {
    async function init() {
      editorref.current = CodeMirror.fromTextArea(
        document.getElementById("realtimeeditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorref.current.on("change", (instance, changes) => {
        console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodechange(code);
        if (origin !== "setValue") {
          socketref.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
        console.log(code);
      });
    }

    init();
  }, []);

  useEffect(() => {
    if (socketref.current) {
      socketref.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorref.current.setValue(code);
        }
      });
    }

    return () => {
      socketref.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketref.current]);

  return <textarea id="realtimeeditor"></textarea>;
};

export default Editor;
