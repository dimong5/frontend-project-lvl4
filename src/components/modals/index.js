import AddChannel from "./AddChannel";
import RenameChannel from "./RenameChannel";
import RemoveChannel from "./RemoveChannel";

const modals = {
  addChannel: AddChannel,
  renameChannel: RenameChannel,
  removeChannel: RemoveChannel,
};

const modal = (modal) => modals[modal];

export default modal;