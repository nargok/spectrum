// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icon';
import FullscreenView from 'src/components/fullscreenView';
import LoginButtonSet from 'src/components/loginButtonSet';
import {
  LargeTitle,
  LargeSubtitle,
  UpsellIconContainer,
  FullscreenContent,
  CodeOfConduct,
} from './style';
import queryString from 'query-string';
import { track, events } from 'src/helpers/analytics';
import { CLIENT_URL } from 'src/api/constants';
import { setTitlebarProps } from 'src/actions/titlebar';

type Props = {
  redirectPath: ?string,
  signinType?: ?string,
  close?: Function,
  location?: Object,
  dispatch: Function,
};

class Login extends React.Component<Props> {
  componentDidMount() {
    let redirectPath;
    const { dispatch } = this.props;
    dispatch(setTitlebarProps({ title: 'Login' }));

    if (this.props.location) {
      const searchObj = queryString.parse(this.props.location.search);
      redirectPath = searchObj.r;
    }

    track(events.LOGIN_PAGE_VIEWED, { redirectPath });
  }

  render() {
    const { redirectPath, signinType = 'signin' } = this.props;

    const viewTitle =
      signinType === 'login' ? 'Welcome back!' : 'Sign in to get started';

    const viewSubtitle =
      signinType === 'login'
        ? "We're happy to see you again - sign in below to get back into the conversation!"
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.';

    return (
      <FullscreenView closePath={CLIENT_URL}>
        <FullscreenContent
          data-cy="login-page"
          style={{ justifyContent: 'center' }}
        >
          <UpsellIconContainer>
            <Icon glyph={'emoji'} size={64} />
          </UpsellIconContainer>
          <LargeTitle>{viewTitle}</LargeTitle>
          <LargeSubtitle>{viewSubtitle}</LargeSubtitle>

          <LoginButtonSet redirectPath={redirectPath} signinType={signinType} />

          <CodeOfConduct>
            By using Spectrum, you agree to our{' '}
            <a
              href="https://github.com/withspectrum/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track(events.CODE_OF_CONDUCT_CLICKED, { location: 'login' })
              }
            >
              Code of Conduct
            </a>
            , <Link to={'/privacy'}>Privacy Policy</Link> and{' '}
            <Link to={'/terms'}>Terms of Service</Link>.
          </CodeOfConduct>
        </FullscreenContent>
      </FullscreenView>
    );
  }
}

export default compose(
  withRouter,
  connect()
)(Login);
