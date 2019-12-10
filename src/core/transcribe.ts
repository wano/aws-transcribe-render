import {TranscribeResult} from "./schema";

const Mustache = require("mustache");

export default class Transcribe {

  parsedJson : TranscribeResult;
  lineTemplate : string = `## {{ time }} {{ speaker }}:  \n {{ text }}  \n\n`;

  speakers  : {[key:string] : string} = {};

  parsedLines : Array<Line> = [];

  constructor(originalJson : string){
    console.log(originalJson)
    this.parsedJson = JSON.parse(originalJson);
    this.parse();
  }

  private parse(){

    const labels = this.parsedJson.results.speaker_labels.segments;
    const speakerStartTimes : any = {};

    for (let label of labels) {
      for (let item of label.items) {
        speakerStartTimes[item.start_time] = label.speaker_label;
      }
    }

    const items = this.parsedJson.results.items!;
    let currentSpeaker;
    let line = '';
    let speaker : any = null;
    const lines : Array<Line>= [];
    let time = "0";

    for (let item of items) {
      if (item?.alternatives?.length == 0){
        continue
      }
      const ii = item as any;
      const content = ii.alternatives[0].content;
      if (item.start_time != null) {
        currentSpeaker = speakerStartTimes[item.start_time];
      } else if (item.type == 'punctuation') {
        line += "" + content;
      }

      if (speaker != currentSpeaker) {
        if (speaker) {
          this.speakers[speaker] = speaker;
          lines.push({
            speaker : speaker,
            text : line,
            time : time
          })
        }

        line = content;
        speaker = currentSpeaker;
        time = item.start_time!;
      } else if (item.type != 'punctuation' ){
        line += " " + content;
      }
    }

    lines.push({
      speaker : speaker,
      text : line,
      time : time
    });

    this.parsedLines = lines;

  }

  public render() : string {
    let outputs = "";
    for (let line of this.parsedLines) {
      const l = {...line , ...{speaker: this.speakers[line.speaker]}};
      var output = Mustache.render(this.lineTemplate, l);
      outputs += output;
    }
    return outputs;
  }

  public setTemplate(str : string){
    this.lineTemplate = str;
  }

  get allSpeakers() : {[key:string]:string} {
    return this.speakers;
  }

  public overrideSpeakerName(key : string, val : string){
    this.speakers[key] = val;
  }
}

interface Line {
  speaker : string,
  time : string,
  text : string,
}