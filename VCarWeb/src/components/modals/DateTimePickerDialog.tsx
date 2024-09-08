import React, { useState } from 'react';
import { Modal, DatePicker, TimePicker, Button, Row, Col } from 'antd';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

const DateTimePickerDialog: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<[Moment, Moment] | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onDateChange = (dates: [Moment, Moment] | null) => {
    setSelectedDates(dates);
  };

  const onStartTimeChange = (time: Moment | null) => {
    setStartTime(time);
  };

  const onEndTimeChange = (time: Moment | null) => {
    setEndTime(time);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Date Time Picker
      </Button>
      <Modal
        title="Thời gian"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="continue" type="primary" onClick={handleOk}>
            Tiếp tục
          </Button>,
        ]}
      >
        {/* Date Range Picker */}
        <div className="mb-6">
          <RangePicker
            onChange={onDateChange}
            value={selectedDates}
            format="DD/MM/YYYY"
            className="w-full"
            placeholder={['Ngày nhận xe', 'Ngày trả xe']}
          />
        </div>

        {/* Time Pickers */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <TimePicker
              value={startTime}
              onChange={onStartTimeChange}
              format="HH:mm"
              className="w-full"
              placeholder="Nhận xe"
            />
          </Col>
          <Col span={12}>
            <TimePicker
              value={endTime}
              onChange={onEndTimeChange}
              format="HH:mm"
              className="w-full"
              placeholder="Trả xe"
            />
          </Col>
        </Row>

        {/* Display Summary */}
        {selectedDates && startTime && endTime && (
          <div className="p-4 bg-gray-100 rounded">
            <p>
              {`Nhận xe: ${startTime.format('HH:mm')}, ${selectedDates[0].format('DD/MM/YYYY')}`}
            </p>
            <p>
              {`Trả xe: ${endTime.format('HH:mm')}, ${selectedDates[1].format('DD/MM/YYYY')}`}
            </p>
            <p>
              Số ngày thuê: {selectedDates[1].diff(selectedDates[0], 'days')} ngày
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DateTimePickerDialog;
