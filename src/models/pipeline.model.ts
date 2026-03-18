export type PipelineAction = "uppercase" | "add_timestamp" | "filter_field";

export type Pipeline = {
  id: number;
  name: string;
  action: PipelineAction;
  subscribers: string[];
};