declare namespace WechatMiniprogram {
  namespace DB {
    interface ICommand {
      eq(val: any): ICommand
      neq(val: any): ICommand
      gt(val: any): ICommand
      gte(val: any): ICommand
      lt(val: any): ICommand
      lte(val: any): ICommand
      in(val: any[]): ICommand
      nin(val: any[]): ICommand
      and(...commands: ICommand[]): ICommand
      or(...commands: ICommand[]): ICommand
    }
  }
}
