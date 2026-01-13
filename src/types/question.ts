export interface Question {
  question: string;
  statements: Statement[];
  required?: boolean;
}

export interface Statement {
  text: string;
  title: string;
  desc: string;
}
