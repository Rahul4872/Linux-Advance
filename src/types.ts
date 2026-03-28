export interface CommandDef {
  cmd: string;
  desc: string;
}

export interface SectionDef {
  title: string;
  content: string;
  commands?: CommandDef[];
}

export interface TopicDef {
  id: string;
  title: string;
  icon: string;
  sections: SectionDef[];
}
