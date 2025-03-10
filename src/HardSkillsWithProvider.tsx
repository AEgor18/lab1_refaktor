import { QueryClient, QueryClientProvider } from 'react-query';
import HardSkills from './widgets/HardSkills/HardSkills';

const HardSkillsWithProvider = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<HardSkills />
		</QueryClientProvider>
	);
};

export default HardSkillsWithProvider;
