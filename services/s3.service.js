import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});

export const generatePresignedUrl = async (key, contentType) => {
	const command = new PutObjectCommand({
		Bucket: 'driven-prod-bucket',
		Key: key,
		ContentType: contentType,
	});

	const url = await getSignedUrl(s3, command, { expiresIn: 60 });
	return url;
};
