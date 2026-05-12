// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://thok404.github.io',
	base: '/RemotePhotoDocs',
	integrations: [
		starlight({
			title: 'RPS Documentation',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				ja: {
					label: '日本語',
					lang: 'ja',
				},
				zh: {
					label: '中文',
					lang: 'zh',
				},
				ko: {
					label: '한국어',
					lang: 'ko',
				},
			},
			sidebar: [
				{
					slug: 'quick-start',
					translations: { ja: 'クイックスタート', zh: '快速开始', ko: '빠른 시작' },
				},
				{
					label: 'Configuration',
					slug: 'configuration',
					translations: { ja: '設定', zh: '配置', ko: '설정' },
				},
				{
					label: 'Components',
					translations: { ja: 'コンポーネント', zh: '组件', ko: '컴포넌트' },
					items: [
						{ slug: 'components/components' },
						{ slug: 'components/remotephotomanager' },
						{ slug: 'components/remotephotogroup' },
						{ slug: 'components/remotephotoframe' },
						{ slug: 'components/remotephotobutton' },
					],
				},
				{
					slug: 'webtool',
					translations: { ja: 'Webツール', zh: '网页工具', ko: '웹 도구' },
				},
				{
					slug: 'self-hosted-image-solution',
					translations: {
						ja: 'セルフホスト画像ソリューション',
						zh: '自托管图片方案',
						ko: '셀프 호스팅 이미지 솔루션',
					},
				},
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/thok404/RemotePhotoSystem' }],
		}),
	],
});
