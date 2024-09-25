import React from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import EditorJs from 'react-editor-js';
//import { EDITOR_JS_TOOLS } from './tool'

class Orgobjects extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editorState : EditorState.createEmpty()
        }
    }

    onEditorStateChange = (editorState) => {
       // console.log(editorState)
        this.setState({
          editorState,
        });
        
      };

    render () {
        const { editorState } = this.state;
        return (<div style={{padding:10}}>
            
            </div>)
    }
}

export default Orgobjects