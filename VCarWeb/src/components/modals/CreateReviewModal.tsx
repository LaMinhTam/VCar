import { Form, Input, Rate, Button } from 'antd';
import { useState } from 'react';
import { createReview } from '../../store/rental/handlers';

const { TextArea } = Input;

interface FieldValues {
    rating: number;
    comment: string;
}

const CreateReviewModal = ({ contract_id, setOpen }: {
    contract_id: string;
    setOpen: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = async (values: FieldValues) => {
        setLoading(true);
        const response = await createReview({
            rental_contract_id: contract_id,
            rating: values.rating,
            comment: values.comment,
        });
        if (response?.success) {
            console.log("handleFinish ~ response:", response)
            setOpen(false);
            form.resetFields();
        } else {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Form.Item<FieldValues>
                name="rating"
                label="Rating"
                rules={[{ required: true, message: 'Please provide a rating' }]}
            >
                <Rate />
            </Form.Item>
            <Form.Item<FieldValues>
                name="comment"
                label="Comment"
                rules={[{ required: true, message: 'Please provide a comment' }]}
            >
                <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateReviewModal;