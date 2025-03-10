import axios from 'axios';

const API = 'https://67af9f13dffcd88a67872d36.mockapi.io';

export const fetchHardSkills = async (): Promise<
	{ Hard_skillID: number; Title: string }[]
> => {
	try {
		const response = await axios.get(`${API}/hardskills/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching hard skills:', error);
		throw error;
	}
};

export const addHardSkill = async (title: string) => {
	try {
		const response = await axios.post(
			`${API}/hardskills/`,
			{ Title: title },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при добавлении навыка:', error);
		throw error;
	}
};

export const deleteHardSKill = async (id: number) => {
	try {
		const response = await axios.delete(`${API}/hardskills/${id}`);
		return response;
	} catch (error) {
		console.log('Ошибка при удалении навыка: ', error);
		throw error;
	}
};

export const updateHardSkill = async (id: number, title: string) => {
	try {
		const response = await axios.put(
			`${API}/hardskills/${id}`,
			{ Title: title },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Ошибка при обновлении навыка:', error);
		throw error;
	}
};
