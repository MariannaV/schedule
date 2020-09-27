import React from 'react';
import { GithubAvatar } from 'components/GithubAvatar';
import { CommentItem } from './CommentItem';
import { IComments } from './@types';
import { CommentsContext } from './CommentsWidget';
import commentsStyles from './Comments.module.scss';

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
    <article className={commentsStyles.CommentItem}>
      <header>
        <GithubAvatar githubId={''} size={24} />
        <h2 children={`Author: ${comment.author}`} />
      </header>
      <CommentItem isReadOnly comment={comment} />
    </article>
  );
};

export { CommentsList };
