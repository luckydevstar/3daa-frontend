import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { Creators as NewsActions } from 'app/news/actions';
import Editor from '../components/news/editor';

const {
  components: { UIPortal, CloudinaryMedia }
} = common;

class NewsArticleEditorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: props.activities
    };
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {}

  UNSAFE_componentWillMount() {}

  componentWillUnmount() {
    const { toggleViewNewsArticle } = this.props;
    toggleViewNewsArticle(false);
  }

  onSave(result) {
    const {
      news,
      newsEditForm,
      createNewsAttempt,
      updateNewsAttempt
    } = this.props;

    let values = { ...newsEditForm.values };
    if (values.cover)
      values.cover =
        typeof values.cover === 'string' ? values.cover : values.cover[0];

    values = {
      slug: values.slug,
      news_id: values.news_id,
      news_provider_id: values.news_provider_id,
      title: values.title,
      short_content: values.short_content,
      status: values.status,
      featured: values.featured,
      inspired: values.inspired,
      tags: values.tags,
      cover: values.cover,
      content: result
    };

    if (news && news.news_id == values.news_id) {
      updateNewsAttempt(values, values.news_id);
    } else {
      createNewsAttempt(values);
    }
  }

  render() {
    const { user, children, attemptingPostNews } = this.props;

    return (
      <div className="workbooks-builder-container">
        <Editor
          ref={e => {
            this.editor = e;
          }}
          user={user}
          formName="newsEdit"
          onSave={this.onSave}
          saving={attemptingPostNews}
        />
        {children && (
          <UIPortal isOpened>
            <div>{children}</div>
          </UIPortal>
        )}
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  user: state.profile.user,
  news: path(['news', 'currentNews'])(state),
  newsEditForm: path(['form', 'newsEdit'])(state),
  newsProvider: path(['news', 'currentNewsProvider'])(state),
  attemptingPostNews: path(['news', 'attemptingPostNews'])(state)
});

const mapDispatchToProps = dispatch => ({
  createNewsAttempt: payload =>
    dispatch(NewsActions.createNewsAttempt(payload)),
  updateNewsAttempt: (payload, id) =>
    dispatch(NewsActions.updateNewsAttempt(payload, id)),
  toggleViewNewsArticle: payload =>
    dispatch(NewsActions.toggleViewNewsArticle(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsArticleEditorContainer);
