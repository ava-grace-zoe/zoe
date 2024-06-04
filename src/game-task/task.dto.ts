//status 0 进行中, 1成功 2失败

export class TaskDTO {
  taskId: string;
  status: number;
  reason?: string;
}
