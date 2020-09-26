import React from 'react';
import { CommentItem } from './CommentItem';
import { IComments } from './@types';
import { CommentsContext } from './CommentsWidget';
import { GithubAvatar } from 'components/GithubAvatar';

const CommentsList: React.FC = () => {
  const { comments } = React.useContext(CommentsContext),
    items = React.useMemo(() => comments?.map((comment) => <Comment comment={comment} key={comment.commentId} />), [
      comments,
    ]);

  if (!comments?.length) return null;

  return <div children={items} />;
};

const Comment: React.FC<{ comment: IComments.Comment }> = (props) => {
  const { comment } = props;

  return (
    <article>
      <GithubAvatar githubId={''} size={24} />
      <header>
        <h2 children={`Author: ${comment.author}`} />
      </header>
      <CommentItem isReadOnly comment={comment} />
    </article>
  );
};

export { CommentsList };
