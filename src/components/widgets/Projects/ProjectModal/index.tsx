import React from 'react';
import { Input, Col, Row } from 'antd';

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProjectModal = ({ onChange }: Props) => {
  return (
    <>
      <Row>
        <Col className="mr-2" xs={11}>
          <p className="mb-2">Project Title</p>
          <Input
            onChange={onChange}
            className="mb-3"
            placeholder="Project title"
          />
        </Col>
        <Col xs={12}>
          <p className="mb-2">Project Root Directory</p>
          <Input className="mb-3" placeholder="Project Root Directory" />
        </Col>
      </Row>
      <Row>
        <Col className="mr-2" xs={11}>
          <p className="mb-2">App user</p>
          <Input className="mb-3" placeholder="App user" />
        </Col>
        <Col xs={12}>
          <p className="mb-2">App group</p>
          <Input className="mb-3" placeholder="App group" />
        </Col>
      </Row>
      <Row>
        <Col className="mr-2" xs={11}>
          <p className="mb-2">Emperor Root Directory</p>
          <Input className="mb-3" placeholder="Emperor Root Directory" />
        </Col>
        <Col xs={12}>
          <p className="mb-2">Virtualenv Directory:</p>
          <Input className="mb-3" placeholder="Virtualenv Directory" />
        </Col>
      </Row>
    </>
  );
};

export default ProjectModal;
