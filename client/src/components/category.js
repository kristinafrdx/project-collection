import { useTranslation } from "react-i18next";

const Options = () => {
  const { t } = useTranslation();
  return [
    {value: 'Art', label: t('options.art')},
    {value: 'Stamps', label: t('options.stamps')},
    {value: 'Cars', label: t('options.cars')},
    {value: 'Coins', label: t('options.coins')},
    {value: 'Films', label: t('options.films')},
    {value: 'Stickers', label: t('options.stickers')},
    {value: 'Candy wrapper', label: t('options.candyWrapper')},
    {value: 'Stones', label: t('options.stones')},
    {value: 'Books', label: t('options.books')},
    {value: 'Songs', label: t('options.songs')},
    {value: 'Other', label: t('options.other')}
  ]
}

export default Options;