import { generatePresignedUrl } from '../services/s3.service.js';
import { v4 as uuidv4 } from 'uuid';

export const getPresignedUrl = async (req, res, next) => {
	try {
		const { contentType } = req.query;
		if (!contentType) return res.status(400).json({ message: 'Missing contentType' });

		const fileKey = `uploads/${uuidv4()}`;
		const url = await generatePresignedUrl(fileKey, contentType);
		const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

		res.json({ url, publicUrl });
	} catch (err) {
		next(err);
	}
};
