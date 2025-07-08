// seed.js
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const positions = ['QB', 'RB', 'WR', 'LB', 'CB', 'S', 'OL', 'DL', 'TE', 'K'];
const schools = ['Central HS', 'Liberty Prep', 'Metro Academy', 'Hillview', 'North Ridge'];
const cities = ['Atlanta', 'Miami', 'Dallas', 'Charlotte', 'Chicago'];
const states = ['GA', 'FL', 'TX', 'NC', 'IL'];
const sport = 'Football';

async function seed() {
	await mongoose.connect(MONGO_URI);
	await User.deleteMany({});
	await Team.deleteMany({});

	console.log('🔄 Old data cleared.');

	const teams = [];

	for (let i = 0; i < 5; i++) {
		const coach = await User.create({
			name: `Coach ${i + 1}`,
			email: `coach${i + 1}@example.com`,
			password: '123456',
			role: 'coach',
			bio: 'Experienced youth football coach',
			profileImage: 'https://abc45.com/resources/media2/1x1/1736/1796/676x0/90/3bf1ad15-a07a-4dae-8322-22de65f8051b-AP25112541376621.jpg'
		});

		const team = await Team.create({
			name: `Team ${i + 1}`,
			sport,
			level: 'U14',
			createdBy: coach._id,
			logo: 'https://cdn.freebiesupply.com/images/large/2x/detroit-lions-logo-transparent.png',
		});

		const players = [];

		for (let j = 0; j < 10; j++) {
			const position = positions[Math.floor(Math.random() * positions.length)];

			const player = await User.create({
				name: `Player ${i + 1}-${j + 1}`,
				email: `player${i + 1}_${j + 1}@example.com`,
				password: '123456',
				role: 'player',
				profileImage: 'https://i.guim.co.uk/img/media/f59d2ac8431f44d32721e75ab3473894902d740d/0_31_1992_1195/master/1992.jpg?width=1140&dpr=2&s=none&crop=none',
				position,
				dob: new Date(2010 + Math.floor(Math.random() * 4), 0, 1),
				nickname: `Flash${j + 1}`,
				height: `${Math.floor(Math.random() * 12) + 60}"`,
				weight: `${Math.floor(Math.random() * 60) + 100} lbs`,
				school: schools[i],
				gradYear: 2028 + j % 3,
				location: {
					city: cities[i],
					state: states[i],
				},
				gpa: (2.5 + Math.random() * 1.5).toFixed(2),
				highlightFilm: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				customColors: {
					primary: '#1e3a8a',
					secondary: '#facc15',
				},
				combineResults: [
					{
						date: new Date(),
						metrics: {
							fortyYardDash: (4.5 + Math.random()).toFixed(2),
							verticalJump: (25 + Math.random() * 10).toFixed(1),
							broadJump: (90 + Math.random() * 20).toFixed(1),
							benchPress: Math.floor(Math.random() * 10) + 5,
							shuttle: (4.0 + Math.random()).toFixed(2),
							threeCone: (7.0 + Math.random()).toFixed(2),
						},
					},
				],
				team: team._id,
			});

			players.push(player._id);
		}

		team.players = players;
		await team.save();
		teams.push(team);
	}

	console.log('✅ Seed complete: 5 teams with 10 players each.');
	mongoose.disconnect();
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	mongoose.disconnect();
});
