import { RootState } from "../repository/store";

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
}
