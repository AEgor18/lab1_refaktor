'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
	useMutation,
	useQuery,
	QueryClient,
	QueryClientProvider,
} from 'react-query';
import { Button, Spin, Modal, Input } from 'antd';
import style from './HardSkills.module.scss';
import axios from 'axios';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
});

const HardSkills: React.FC = () => {
	const [activeID, setActive] = useState<number | null>(null);
	const [searchValue, setSearchValue] = useState<string>('');
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const [addModal, setAddModal] = useState<boolean>(false);
	const [addValue, setAddValue] = useState<string>('');
	const [changeModal, setChangeModal] = useState<boolean>(false);
	const [changeValue, setChangeValue] = useState<string>('');

	const fetchHardSkills = async (): Promise<
		{ Hard_skillID: number; Title: string }[]
	> => {
		try {
			const response = await axios.get(
				'https://67af9f13dffcd88a67872d36.mockapi.io/services/hardskills/'
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching hard skills:', error);
			throw error;
		}
	};

	const addHardSkill = async (title: string) => {
		try {
			const response = await axios.post(
				`https://67af9f13dffcd88a67872d36.mockapi.io/services/hardskills/?title=${title}`,
				{},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			return response;
		} catch (error) {
			console.error('Ошибка при добавлении навыка:', error);
			throw error;
		}
	};

	const deleteHardSKill = async (id: number) => {
		try {
			const response = await axios.delete(
				`https://67af9f13dffcd88a67872d36.mockapi.io/services/hardskills/${id}`
			);
			return response;
		} catch (error) {
			console.log('Ошибка при удалении навыка: ', error);
			throw error;
		}
	};

	const updateHardSkill = async (id: number, title: string) => {
		try {
			const response = await axios.put(
				`https://67af9f13dffcd88a67872d36.mockapi.io/services/${id}?Title=${title}`
			);
			return response.data;
		} catch (error) {
			console.error('Ошибка при обновлении навыка:', error);
			throw error;
		}
	};

	const {
		data: hardSkills,
		isLoading,
		error,
	} = useQuery(['hardSkills'], () => fetchHardSkills(), {
		refetchOnWindowFocus: false,
		retry: false,
	});

	const addMutation = useMutation((title: string) => addHardSkill(title), {
		onSuccess: () => {
			queryClient.invalidateQueries(['hardSkills']);
			setAddModal(false);
			setAddValue('');
		},
		onError: (error) => {
			console.error('Ошибка при добавлении навыка:', error);
		},
	});

	const deleteMutation = useMutation(deleteHardSKill, {
		onSuccess: () => {
			queryClient.invalidateQueries(['hardSkills']);
			setActive(null);
		},
		onError: (error) => {
			console.error('Ошибка при удалении навыка:', error);
		},
	});

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setActive(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const updateMutataion = useMutation(
		(title: string) => {
			if (activeID === null) {
				throw new Error('activeID не должен быть null');
			}
			return updateHardSkill(activeID, title);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['hardSkills']);
				setActive(null);
				setChangeModal(false);
				setChangeValue('');
			},
			onError: (error) => {
				console.error('Ошибка при обновлении навыка:', error);
			},
		}
	);

	const filteredHardSkills = hardSkills?.filter((skill) => {
		return skill.Title.toLowerCase().includes(searchValue.toLowerCase());
	});

	if (isLoading) return <Spin size='large' className={style.spin} />;

	if (error) {
		return <div className={style.empty}>Нет доступных вакансий</div>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<div className={style.hidden}>
				<div className={style.wrapper} ref={wrapperRef}>
					<div className={style.functional}>
						<Button
							type='primary'
							className={style.button}
							onClick={() => setAddModal(true)}
						>
							Добавить
						</Button>

						{activeID && (
							<>
								<Button
									type='primary'
									className={style.button}
									onClick={() =>
										deleteMutation.mutate(activeID)
									}
								>
									Удалить
								</Button>
								<Button
									type='primary'
									className={style.button}
									onClick={() => setChangeModal(true)}
									disabled
								>
									Изменить
								</Button>
							</>
						)}
						<input
							type='text'
							placeholder='Поиск навыков'
							className={style.input}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</div>
					<ul className={style.list}>
						{(filteredHardSkills ?? []).length > 0 ? (
							filteredHardSkills?.map((skill) => {
								const StyleId =
									activeID === skill.Hard_skillID
										? style.active
										: '';
								return (
									<li
										key={skill.Hard_skillID}
										className={`${style.item} ${StyleId}`}
										onClick={() =>
											setActive(skill.Hard_skillID)
										}
									>
										{skill.Title}
									</li>
								);
							})
						) : (
							<div className={style.skillsNotFound}>
								Навыки не найдены
							</div>
						)}
					</ul>
					{addModal && (
						<Modal
							title='Добавить навык'
							open={addModal}
							onCancel={() => setAddModal(false)}
							footer={null}
						>
							<Input
								placeholder='Введите название навыка'
								value={addValue}
								onChange={(e) => setAddValue(e.target.value)}
							/>
							<div className={style.modal}>
								<Button
									className={style.modalButton}
									onClick={() => setAddModal(false)}
								>
									Отмена
								</Button>
								<Button
									type='primary'
									className={style.button}
									onClick={() => addMutation.mutate(addValue)}
								>
									Подтвердить
								</Button>
							</div>
						</Modal>
					)}
					{changeModal && (
						<Modal
							title='Изменить навык'
							open={changeModal}
							onCancel={() => setChangeModal(false)}
							footer={null}
						>
							<Input
								placeholder='Введите название навыка'
								value={changeValue}
								onChange={(e) => setChangeValue(e.target.value)}
							/>
							<div className={style.modal}>
								<Button
									className={style.modalButton}
									onClick={() => setChangeModal(false)}
								>
									Отмена
								</Button>
								<Button
									type='primary'
									className={style.button}
									onClick={() =>
										updateMutataion.mutate(changeValue)
									}
								>
									Подтвердить
								</Button>
							</div>
						</Modal>
					)}
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default HardSkills;
