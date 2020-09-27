import React from 'react';
import { IComments } from './@types';
import { CommentsList } from './CommentsList';
import { CommentItem } from './CommentItem';
import { GithubAvatar } from 'components/GithubAvatar';
import { UserOutlined } from '@ant-design/icons';

export const CommentsContext = React.createContext<IComments.Widget>({});

const CommentsWidget: React.FC<IComments.Widget> = (props) => {
  const { comments } = props;
  return (
    <section>
      <h6 children={`${comments?.length || 'No'} comments`} />
      <CommentsContext.Provider value={props}>
        <GithubAvatar githubId={''} size={24} style={{ backgroundImage: `${(<UserOutlined />)}` }} />
        <CommentItem />
        {!!comments?.length && <CommentsList />}
      </CommentsContext.Provider>
    </section>
  );
};

const withMemo = React.memo(CommentsWidget);
export { withMemo as CommentsWidget };
