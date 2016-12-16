// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import Client from 'client/web_client.jsx';
import * as Utils from 'utils/utils.jsx';

import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

export default class PurgeCachesButton extends React.Component {
    constructor(props) {
        super(props);

        this.handlePurge = this.handlePurge.bind(this);

        this.state = {
            loading: false,
            fail: null
        };
    }

    handlePurge(e) {
        e.preventDefault();

        this.setState({
            loading: true,
            fail: null
        });

        Client.invalidateAllCaches(
            () => {
                this.setState({
                    loading: false
                });
            },
            (err) => {
                this.setState({
                    loading: false,
                    fail: err.message + ' - ' + err.detailed_error
                });
            }
        );
    }

    render() {
        if (global.window.mm_license.IsLicensed !== 'true') {
            return <div/>;
        }

        let testMessage = null;
        if (this.state.fail) {
            testMessage = (
                <div className='alert alert-warning'>
                    <i className='fa fa-warning'/>
                    <FormattedMessage
                        id='admin.purge.purgeFail'
                        defaultMessage='Purging unsuccessful: {error}'
                        values={{
                            error: this.state.fail
                        }}
                    />
                </div>
            );
        }

        const helpText = (
            <FormattedHTMLMessage
                id='admin.purge.purgeDescription'
                defaultMessage='This will purge all the in-memory caches for things like sessions, accounts, channels, etc. Deployments using High Availability will attempt to purge all the servers in the cluster.  Purging the caches may adversly impact performance.'
            />
        );

        let contents = null;
        if (this.state.loading) {
            contents = (
                <span>
                    <span className='fa fa-refresh icon--rotate'/>
                    {Utils.localizeMessage('admin.purge.loading', ' Loading...')}
                </span>
            );
        } else {
            contents = (
                <FormattedMessage
                    id='admin.purge.button'
                    defaultMessage='Purge All Caches'
                />
            );
        }

        return (
            <div className='form-group reload-config'>
                <div className='col-sm-offset-4 col-sm-8'>
                    <div>
                        <button
                            className='btn btn-default'
                            onClick={this.handlePurge}
                        >
                            {contents}
                        </button>
                        {testMessage}
                    </div>
                    <div className='help-text'>
                        {helpText}
                    </div>
                </div>
            </div>
        );
    }
}
