import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transcribe from "../core/transcribe";
import {useState} from "react";

//@ts-ignore
import TextareaAutosize from 'react-textarea-autosize';

const App = ()=> {

  const [text, setText] = useState<string>("");
  const [template, setTemplateText] = useState<string>(`## {{ speaker }}: \n"{{ text }}"  \n{{ time }}sec  \n\n`);
  const [ts, setTs] = useState<any>(null);
  //let ts : Transcribe|null= null;

  const rerender = ()=> {
    if (ts == null){
      return;
    }

    ts.setTemplate(template);
    const rendered = ts.render();
    setText(rendered);
  };

  return(
    <div className={"wrapper"} style={{padding: "32px"}}>
      <div className="container">
        <div className="row">
          <h1> aws-transcribe-render </h1>
        </div>
        <div className="row">
          <label >Transcribe File </label>
        </div>
        <div className={"row"}>
          <label htmlFor={"jsonFile"} className={"button"}  > Select Your Transcribe File </label>
          <input
            id={"jsonFile"}
            style={{display:"none"}}
            type="file"
            onChange={(e : any) => {

              if (e?.target?.files?.length == 0 ){
                return;
              }

              const reader = new FileReader();
              reader.onload = async (_e : any) => {
                const text = (_e.target.result) as string;
                const _ts = new Transcribe(text);
                _ts.setTemplate(template);
                const rendered = _ts.render();
                setTs(_ts);
                setText(rendered);
              };
              reader.readAsText(e.target.files[0])
            }}
          />
        </div>
        <div className="row">
          <label >Template of Render Paragraph </label>
        </div>
        <div className={"row"}>
          <textarea defaultValue={template}  onChange={e => setTemplateText(e.target.value)}/>
        </div>
        <SpeakerOverride transcribe={ts} />
        <div className="row">
          <label >Result</label>
        </div>
        <div className="row">
          {ts != null  && (<button className="button" onClick={()=>{ rerender(); }} > Re:render </button> )}
        </div>
        <div  className="row">
          <TextareaAutosize
            value={text}
            maxRows={512}
          />
        </div>

      </div>
    </div>
  );

};

const SpeakerOverride = ({transcribe}:{transcribe?:Transcribe})=> {

  if (transcribe ==null ){
    return <></>
  }
  if (Object.keys(transcribe.allSpeakers).length == 0 ) {
    return <></>
  }

  const speakers = transcribe.allSpeakers;

  const allSpeakers = Object.keys(speakers).
    sort().
    map((s)=>{
    return (
      <div key={s} className="column-10 column-offset-25 " style={{marginRight:"16px"}}>
        <span>{ String(s) }</span>:
        <input
          type="text"
          defaultValue={speakers[s]}
          onChange={e => {
            transcribe.overrideSpeakerName(s , e.target.value);
          }}
        />
      </div>
    );
  });

  return (
    <>
      <div className="row">
        <label >Override SpeakerName</label>
      </div>
      <div className="row">
          {allSpeakers}
      </div>
    </>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


