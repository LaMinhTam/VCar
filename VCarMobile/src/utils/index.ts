import numeral from 'numeral';
import moment from 'moment';
import {Dispatch} from '@reduxjs/toolkit';
import axios from 'axios';
import {Toast} from '@ant-design/react-native';
import {RefObject} from 'react';

export const formatPrice = (price: number) => {
  return numeral(price).format('0,0');
};

export const formatDate = (date: string | Date | number) => {
  // using moment to format timestamp to dd/mm/yyyy hh:mm
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const convertDateToTimestamp = (date: string | Date) => {
  return moment(date).valueOf();
};

export const calculateDays = (
  startTimestamp: number | null,
  endTimestamp: number | null,
): number => {
  if (startTimestamp === null || endTimestamp === null) {
    return 0;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const differenceInMilliseconds = endTimestamp - startTimestamp;
  const numberOfDays = differenceInMilliseconds / millisecondsPerDay;
  return parseFloat(numberOfDays.toFixed(1));
};

export const handleUploadFile = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        onUploadProgress: progressEvent => {
          if (typeof progressEvent.total === 'number') {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
          } else {
            Toast.fail('Failed to upload file');
          }
        },
      },
    );
    const imageUrl = response.data.secure_url;
    if (imageUrl) {
      return imageUrl;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export async function handleUploadSignature(
  sigCanvas: RefObject<any>,
  rental_contract_id: string,
  userId: string,
) {
  try {
    const dataUrl = sigCanvas?.current
      ?.getTrimmedCanvas()
      ?.toDataURL('image/png');
    if (!dataUrl) {
      throw new Error('Failed to get data URL from signature canvas');
    }
    const blob = await (await fetch(dataUrl)).blob();
    // Check if the blob size exceeds 10MB
    const size = blob.size / 1024 / 1024;
    if (size > 10) {
      Toast.fail('Signature file size exceeds 10MB');
      return;
    }
    const timestamp = Date.now();
    const fileName = `signature_${userId}_${timestamp}.png`;

    const formData = new FormData();
    formData.append('file', blob);
    formData.append(
      'upload_preset',
      process.env.VITE_CLOUDINARY_PRESET_NAME || '',
    );
    formData.append('public_id', fileName);
    formData.append('folder', `contracts/${rental_contract_id}`);
    const imageUrl = await handleUploadFile(formData);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading signature:', error);
    return '';
  }
}
