import { CommentsWidget } from './CommentsWidget';
import { CommentsList } from './CommentsList';
import { CommentItem } from './CommentItem';
export { IComments } from './@types';

export const Comments = {
  Create: CommentItem,
  List: CommentsList,
  Widget: CommentsWidget,
};
