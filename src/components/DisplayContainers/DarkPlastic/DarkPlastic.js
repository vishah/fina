import React, { Component } from 'react';
import styles from './DarkPlastic.module.css';
import { Row, Col, Steps } from 'antd';

class DarkPlastic extends Component {

    render() {
        const { Step } = Steps;
        return (
            <div>
                <Row type="flex" justify="center">
                    <Col xl={10} lg={17} md={19} sm={24} xs={24}>
                        <Steps current={this.props.step} className={styles.Steps}>
                            <Step
                                title={<span className={styles.StepTitle}>Step 1</span>}
                                description={<span className={styles.StepDescription}>Request.</span>}
                            />
                            <Step
                                title={<span className={styles.StepTitle}>Step 2</span>}
                                description={<span className={styles.StepDescription}>Select&nbsp;
                            <span className={styles.Type}>{this.props.type}</span>.</span>}
                            />
                            <Step
                                title={<span className={styles.StepTitle}>Step 3</span>}
                                description={<span className={styles.StepDescription}>Confirm.</span>}
                            />
                            <Step
                                title={<span className={styles.StepTitle}>Step 4</span>}
                                description={<span className={styles.StepDescription}>Payment.</span>}
                            />
                        </Steps>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col xl={17} md={24} xs={24}>

                        <div className={styles.Container}>
                            {this.props.children}
                        </div>
                    </Col>
                </Row>
            </div >

        )
    }

}
export default DarkPlastic;
